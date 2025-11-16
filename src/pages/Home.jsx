import { useNavigate } from "react-router-dom";
import { FiLogOut, FiUser, FiSettings, FiBell, FiSearch } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Chart data
const lineChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Users",
      data: [65, 59, 80, 81, 56, 55],
      borderColor: "rgb(99, 102, 241)",
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      tension: 0.3,
      fill: true,
    },
  ],
};

const barChartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Active Users",
      data: [12, 19, 3, 5, 2, 3, 9],
      backgroundColor: "rgba(99, 102, 241, 0.8)",
    },
  ],
};

const stats = [
  {
    name: "Total Users",
    value: "2,345",
    change: "+12%",
    changeType: "increase",
  },
  { name: "Active Now", value: "1,234", change: "+5%", changeType: "increase" },
  {
    name: "Total Revenue",
    value: "$12,345",
    change: "+8.2%",
    changeType: "increase",
  },
  {
    name: "Avg. Session",
    value: "2m 45s",
    change: "-1.2%",
    changeType: "decrease",
  },
];

const recentActivity = [
  {
    id: 1,
    user: "Alex Johnson",
    action: "created a new project",
    time: "2m ago",
  },
  { id: 2, user: "Maria Garcia", action: "updated profile", time: "1h ago" },
  {
    id: 3,
    user: "James Wilson",
    action: "completed onboarding",
    time: "3h ago",
  },
  {
    id: 4,
    user: "Sarah Kim",
    action: "invited 2 team members",
    time: "5h ago",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Logout mutation
  const { mutate: logoutUser, isLoading: isLoggingOut } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("Successfully logged out");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to log out. Please try again.");
    },
  });

  // Authentication is now handled by ProtectedRoute component

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Welcome back, {user?.email || "User"}
              </h1>
              <p className="text-sm text-gray-500">
                Here's what's happening with your account today
              </p>
            </div>
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-8 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                  placeholder="Search..."
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FiUser className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.email || "User"}
                  </span>
                </div>
                <button
                  className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Notifications"
                >
                  <FiBell className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap"
                >
                  <FiLogOut className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* User Profile Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FiUser className="h-10 w-10 text-indigo-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.name || "User"}
                </h2>
                <p className="text-sm text-gray-500">
                  {user?.email || "No email provided"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user?.role || "User"}
                  </span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiSettings className="-ml-1 mr-2 h-4 w-4 text-gray-500" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        stat.changeType === "increase"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow overflow-hidden">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
              User Growth
            </h3>
            <div className="h-56 sm:h-64 -mx-2 sm:-mx-3 -mb-3 sm:-mb-4">
              <Line
                data={lineChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      grid: {
                        drawBorder: false,
                      },
                      ticks: {
                        stepSize: 20,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow overflow-hidden">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
              Weekly Activity
            </h3>
            <div className="h-56 sm:h-64 -mx-2 sm:-mx-3 -mb-3 sm:-mb-4">
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      grid: {
                        drawBorder: false,
                      },
                      ticks: {
                        stepSize: 2,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <li
                  key={activity.id}
                  className="px-3 py-3 sm:px-6 hover:bg-gray-50"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FiUser className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                      </div>
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user}
                        <span className="text-gray-500 font-normal">
                          {" "}
                          {activity.action}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 text-right text-sm">
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all activity
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
