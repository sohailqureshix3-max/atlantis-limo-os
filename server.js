import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Routes
import payrollRoutes from './routes/payroll.js';
import driverRoutes from './routes/drivers.js';
import jobRoutes from './routes/jobs.js';
import invoiceRoutes from './routes/invoices.js';
import vehicleRoutes from './routes/vehicles.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/payroll', payrollRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Root route - serve dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Atlantis Limo OS is running' });
});

// API Documentation
app.get('/api', (req, res) => {
  res.json({
    name: 'Atlantis Limousine OS',
    version: '1.0.0',
    description: 'Complete limousine management system',
    endpoints: {
      payroll: {
        post: '/api/payroll/calculate',
        get: {
          '/api/payroll/:id': 'Get payroll record',
          '/api/payroll/driver/:driverId': 'Get driver payroll history',
          '/api/payroll/:id/slip': 'Download payslip PDF',
          '/api/payroll/period/summary': 'Get payroll period summary'
        },
        actions: {
          'POST /api/payroll/:id/approve': 'Approve payroll',
          'POST /api/payroll/:id/pay': 'Mark payroll as paid'
        }
      },
      drivers: {
        post: '/api/drivers',
        get: {
          '/api/drivers': 'Get all active drivers',
          '/api/drivers/:id': 'Get driver by ID',
          '/api/drivers/:id/compliance': 'Get compliance status',
          '/api/drivers/:id/performance': 'Get performance metrics',
          '/api/drivers/:id/vehicle': 'Get assigned vehicle'
        },
        actions: {
          'PUT /api/drivers/:id': 'Update driver',
          'POST /api/drivers/:id/assign-vehicle': 'Assign vehicle'
        }
      },
      jobs: {
        post: '/api/jobs',
        get: {
          '/api/jobs/:id': 'Get job by ID',
          '/api/jobs/period': 'Get jobs by period',
          '/api/jobs/driver/:driverId': 'Get driver jobs',
          '/api/jobs/daily/summary': 'Get daily summary',
          '/api/jobs/revenue/summary': 'Get revenue summary'
        },
        actions: {
          'POST /api/jobs/:id/complete': 'Complete job',
          'POST /api/jobs/:id/cancel': 'Cancel job'
        }
      },
      invoices: {
        post: '/api/invoices',
        get: {
          '/api/invoices/:id': 'Get invoice',
          '/api/invoices/customer/:customerId': 'Get customer invoices',
          '/api/invoices/:id/pdf': 'Download invoice PDF',
          '/api/invoices/revenue/summary': 'Get revenue summary'
        },
        actions: {
          'POST /api/invoices/:id/payment': 'Record payment'
        }
      },
      vehicles: {
        post: '/api/vehicles',
        get: {
          '/api/vehicles': 'Get all active vehicles',
          '/api/vehicles/:id': 'Get vehicle by ID',
          '/api/vehicles/:id/maintenance': 'Get maintenance history',
          '/api/vehicles/:id/utilization': 'Get utilization report',
          '/api/vehicles/fleet/summary': 'Get fleet summary',
          '/api/vehicles/fleet/costs': 'Get fleet costs'
        },
        actions: {
          'PUT /api/vehicles/:id': 'Update vehicle',
          'POST /api/vehicles/:id/operation': 'Log operation (fuel, maintenance, etc)'
        }
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║        ATLANTIS LIMOUSINE OPERATING SYSTEM                ║
║                                                           ║
║        Server running at http://localhost:${PORT}         ║
║                                                           ║
║  API Documentation: http://localhost:${PORT}/api          ║
║  Health Check: http://localhost:${PORT}/health           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
