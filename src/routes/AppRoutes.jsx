import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// Public Pages
import LandingPage from "../pages/Home/Landing_page";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

// Protected Pages
// import DiscoverQuests from "../quests/Quests/DiscoverQuests";
import SocialFeed from "../pages/Feed/SocialFeed";

import ApplicationsDashboard from "../pages/Applications/ApplicationsDashboard";
import MyApplications from "../pages/Applications/MyApplications";
import Messages from "../pages/Messages/Messages";
import Profile from "../pages/Profile/Profile";
import EditProfile from "../pages/Profile/EditProfile";
import Search from "../pages/Search/Search";
import Notifications from "../pages/Notifications/Notifications";
import Feed from "../pages/Feed/Feed";

import CreateQuest from "../components/quests/Quests/CreateQuest";
import QuestDetail from "../components/quests/Quests/QuestDetail";
import ApplyToQuest from "../components/quests/Quests/ApplyToQuest";
import QuestFeed from "../components/quests/Quests/QuestFeed";
export default function AppRoutes() {
  return (
    <Routes>

      {/* Public Landing Page */}
{/* Public Landing */}
<Route path="/" element={<LandingPage />} />

{/* Public browsing + auth */}
<Route path="/feed" element={<Feed />} />
<Route path="/quests" element={<QuestFeed />} />
<Route path="/quests/:id" element={<QuestDetail />} />
<Route path="/profile/:username" element={<Profile />} />
<Route path="/search" element={<Search />} />
{/* Public Auth Routes */}
<Route element={<PublicRoute />}>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password" element={<ResetPassword />} />
</Route>

{/* Protected Routes */}
<Route element={<ProtectedRoute />}>
  <Route path="/social" element={<SocialFeed />} />

  <Route path="/quests/create" element={<CreateQuest />} />
  <Route path="/quests/:id/apply" element={<ApplyToQuest />} />
  <Route path="/applications" element={<ApplicationsDashboard />} />
  <Route path="/applications/my" element={<MyApplications />} />

  <Route path="/messages" element={<Messages />} />
  <Route path="/messages/:id" element={<Messages />} />

  <Route path="/profile/edit" element={<EditProfile />} />


  <Route path="/notifications" element={<Notifications />} />
</Route>

      {/* 404 */}
      <Route path="*" element={<h1>404 Not Found</h1>} />

    </Routes>
  );
}