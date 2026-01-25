import { MonitoringDashboard } from '@/components/monitoring/MonitoringDashboard';

export const metadata = {
  title: 'Calculator Monitoring Dashboard',
  description: 'Real-time monitoring of calculator performance and accessibility'
};

// Force dynamic rendering - this page needs runtime data
export const dynamic = 'force-dynamic';

export default function MonitoringPage() {
  return (
    <main className="min-h-screen bg-background">
      <MonitoringDashboard />
    </main>
  );
}

