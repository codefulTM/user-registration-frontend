import { useNavigate } from "react-router-dom";
import { FiLogOut, FiUser, FiSettings, FiBell, FiSearch } from "react-icons/fi";
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
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
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
              
              <div className="flex items-center justify-between sm:justify-end space-x-2">
                <button className="p-1.5 sm:p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100">
                  <FiBell className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                
                <div className="flex items-center bg-gray-100 rounded-full p-1 pr-3">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm sm:text-base">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:inline">
                    {user.name || "User"}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">User Growth</h3>
            <div className="h-56 sm:h-64 -mx-2 sm:-mx-3 -mb-3 sm:-mb-4">
              <Line 
                data={lineChartData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      grid: {
                        drawBorder: false
                      },
                      ticks: {
                        stepSize: 20
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow overflow-hidden">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Weekly Activity</h3>
            <div className="h-56 sm:h-64 -mx-2 sm:-mx-3 -mb-3 sm:-mb-4">
              <Bar 
                data={barChartData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      grid: {
                        drawBorder: false
                      },
                      ticks: {
                        stepSize: 2
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="px-3 py-3 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FiUser className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                      </div>
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user}
                        <span className="text-gray-500 font-normal"> {activity.action}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 text-right text-sm">
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              View all activity
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
