/*eslint-disable*/
'use client';

import MainChart from '@/components/dashboard/main/cards/MainChart';
import MainDashboardTable from '@/components/dashboard/main/cards/MainDashboardTable';
import DashboardLayout from '@/components/layout';
import tableDataUserReports from '@/variables/tableDataUserReports';
import { User } from '@supabase/supabase-js';
interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null | any;
}

export default function Main(props: Props) {
  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Design Studio Dashboard"
      description="Manage your design projects and workflows"
    >
      <div className="h-full w-full">
        {/* Hero Section */}
        <div className="relative mb-8">
          <div className="sylo-display sylo-display-lg text-primary absolute -bottom-8 -left-16 z-0 pointer-events-none select-none transform -rotate-90 origin-bottom-left opacity-10">
            DASHBOARD
          </div>
          <div className="relative z-10">
            <h1 className="circular-bold text-3xl text-foreground mb-2">
              Welcome to Sylo Design Studio
            </h1>
            <p className="circular-light text-lg text-muted-foreground">
              Manage your design projects with AI-powered assistance
            </p>
          </div>
        </div>

        <div className="mb-5 flex gap-5 flex-col xl:flex-row w-full">
          <MainChart />
        </div>
        {/* Projects and analytics */}
        <div className="h-full w-full rounded-lg ">
          <MainDashboardTable tableData={tableDataUserReports} />
        </div>
      </div>
    </DashboardLayout>
  );
}
