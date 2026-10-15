import express from 'express';
import { db, Appointment } from './db.ts';
import {
  validateAppointmentForm,
  validateIndianPhone,
  SUNDAY_ERROR_MESSAGE,
} from '../src/utils/appointmentValidation.ts';

export const apiApp = express();

apiApp.use(express.json({ limit: '10mb' }));
apiApp.use(express.urlencoded({ extended: true }));

// Helper auth middleware
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
    return;
  }
  const token = authHeader.slice(7).trim();
  const sessionCheck = db.validateSession(token);
  if (!sessionCheck.valid) {
    res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
    return;
  }
  (req as any).adminEmail = sessionCheck.email;
  next();
}

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

/**
 * Public: Get verified hospital information (address, phone, hours, doctor, services, gallery)
 */
apiApp.get('/api/hospital-info', (_req, res) => {
  try {
    const info = db.getHospitalInfo();
    res.json(info);
  } catch (err: any) {
    res.status(500).json({ error: 'Unable to load hospital information.' });
  }
});

/**
 * Public: Book an appointment.
 * STRICT PRIVACY: Anonymous visitors CANNOT read appointment lists.
 * STRICT VALIDATION: Sunday appointments are rejected. Past dates rejected. Indian phone validated.
 */
apiApp.post('/api/appointments', (req, res) => {
  try {
    const { patientName, phoneNumber, requestedDate, visitReason, consentGiven } = req.body;

    const validation = validateAppointmentForm({
      patientName,
      phoneNumber,
      requestedDate,
      visitReason,
      consentGiven: Boolean(consentGiven),
    });

    if (!validation.isValid) {
      res.status(400).json({
        error: validation.errors.requestedDate || Object.values(validation.errors)[0],
        details: validation.errors,
      });
      return;
    }

    const phoneClean = validateIndianPhone(phoneNumber).cleanPhone || phoneNumber.trim();

    const created = db.createAppointment({
      patientName: patientName.trim(),
      phoneNumber: phoneNumber.trim(),
      cleanPhoneNumber: phoneClean,
      requestedDate: requestedDate.trim(),
      visitReason: (visitReason || '').trim(),
    });

    // Respond only with confirmation details for the requester
    res.status(201).json({
      success: true,
      message: 'Your appointment request has been submitted successfully. Please wait for confirmation from the hospital.',
      appointment: {
        id: created.id,
        patientName: created.patientName,
        requestedDate: created.requestedDate,
        status: created.status,
      },
    });
  } catch (err: any) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ error: 'An unexpected error occurred while booking. Please try again or call the hospital.' });
  }
});

// ==========================================
// ADMIN AUTH ENDPOINTS
// ==========================================

/**
 * Admin Login
 */
apiApp.post('/api/admin/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const authResult = db.authenticateAdmin(email, password);
    if (!authResult.success) {
      res.status(401).json({ error: 'Invalid administrator email or password.' });
      return;
    }

    res.json({
      success: true,
      token: authResult.token,
      user: authResult.user,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
});

/**
 * Check Admin Session
 */
apiApp.get('/api/admin/me', requireAdminAuth, (req, res) => {
  res.json({
    authenticated: true,
    email: (req as any).adminEmail,
  });
});

/**
 * Admin Logout
 */
apiApp.post('/api/admin/logout', requireAdminAuth, (req, res) => {
  const token = req.headers.authorization?.slice(7).trim();
  if (token) {
    db.destroySession(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ==========================================
// PROTECTED ADMIN ENDPOINTS
// ==========================================

/**
 * Get all appointments (Admin only)
 */
apiApp.get('/api/admin/appointments', requireAdminAuth, (_req, res) => {
  try {
    const appointments = db.getAppointments();
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve appointments.' });
  }
});

/**
 * Update appointment status (Admin only)
 */
apiApp.patch('/api/admin/appointments/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses: Appointment['status'][] = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    const updated = db.updateAppointmentStatus(id, status);
    if (!updated) {
      res.status(404).json({ error: 'Appointment not found.' });
      return;
    }

    res.json({ success: true, appointment: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update appointment status.' });
  }
});

/**
 * Delete appointment (Admin only with confirmation)
 */
apiApp.delete('/api/admin/appointments/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteAppointment(id);
    if (!deleted) {
      res.status(404).json({ error: 'Appointment not found.' });
      return;
    }
    res.json({ success: true, message: 'Appointment deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete appointment.' });
  }
});

/**
 * Export appointments to CSV (Admin only)
 */
apiApp.get('/api/admin/export-csv', requireAdminAuth, (_req, res) => {
  try {
    const list = db.getAppointments();
    const headers = ['Appointment ID', 'Patient Name', 'Phone Number', 'Requested Date', 'Status', 'Visit Reason', 'Created At'];
    
    const rows = list.map((a) => [
      `"${a.id}"`,
      `"${a.patientName.replace(/"/g, '""')}"`,
      `"${a.cleanPhoneNumber}"`,
      `"${a.requestedDate}"`,
      `"${a.status}"`,
      `"${(a.visitReason || '').replace(/"/g, '""')}"`,
      `"${a.createdAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="GetWell_Appointments_${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to export CSV.' });
  }
});

/**
 * Update Hospital Info / Settings (Admin only)
 */
apiApp.post('/api/admin/settings', requireAdminAuth, (req, res) => {
  try {
    const updated = db.updateHospitalInfo(req.body);
    res.json({ success: true, hospitalInfo: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings.' });
  }
});

/**
 * Manage gallery image (Admin only)
 */
apiApp.post('/api/admin/gallery', requireAdminAuth, (req, res) => {
  try {
    const { title, category, imageUrl, altText } = req.body;
    if (!imageUrl || !title) {
      res.status(400).json({ error: 'Image URL and title are required.' });
      return;
    }

    const currentInfo = db.getHospitalInfo();
    const newImage = {
      id: `gal-${Date.now()}`,
      title: title.trim(),
      category: category || 'interior',
      imageUrl: imageUrl.trim(),
      altText: altText ? altText.trim() : title.trim(),
    };

    const updatedGallery = [newImage, ...currentInfo.gallery];
    const updated = db.updateHospitalInfo({ gallery: updatedGallery });
    res.json({ success: true, gallery: updated.gallery });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add gallery image.' });
  }
});

/**
 * Delete gallery image (Admin only)
 */
apiApp.delete('/api/admin/gallery/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const currentInfo = db.getHospitalInfo();
    const updatedGallery = currentInfo.gallery.filter((g) => g.id !== id);
    const updated = db.updateHospitalInfo({ gallery: updatedGallery });
    res.json({ success: true, gallery: updated.gallery });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete gallery image.' });
  }
});
