import { MonitoringDashboard } from '@/components/monitoring/MonitoringDashboard';

export const metadata = {
  title: 'Calculator Monitoring Dashboard',
  description: 'Real-time monitoring of calculator performance and accessibility'
};

export default function MonitoringPage() {
  return (
    <main className="min-h-screen bg-background">
      <MonitoringDashboard />
    </main>
  );
}

