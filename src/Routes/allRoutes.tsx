import React from "react";
import { Navigate } from "react-router-dom";

//user registration
import BriquetteDashboard from "../pages/Briquette/BriquetteDashboardPage";
import BriquetteAuditList from "../pages/Briquette/BriquetteAuditDashboard"; 
import SettingsHub from "../pages/settings/index";


import DashboardAnalytics from "../pages/DashboardAnalytics";
import DashboardCrm from "../pages/DashboardCrm";
import DashboardEcommerce from "../pages/DashboardEcommerce";

import DashboardCrypto from "../pages/DashboardCrypto";
import DashboardProject from "../pages/DashboardProject";
import DashboardNFT from "../pages/DashboardNFT";
import DashboardJob from "../pages/DashboardJob";

//Calendar
import Calendar from "../pages/Calendar";
import MonthGrid from "../pages/Calendar/monthGrid";

// Email box
import MailInbox from "../pages/EmailInbox";
import BasicAction from "../pages/Email/EmailTemplates/BasicAction";
import EcommerceAction from "../pages/Email/EmailTemplates/EcommerceAction";

//Chat
import Chat from "../pages/Chat";

//Crm Pages
import CrmCompanies from "../pages/Crm/CrmCompanies";
import CrmContacts from "../pages/Crm/CrmContacts";
import CrmDeals from "../pages/Crm/CrmDeals/index";
import CrmLeads from "../pages/Crm/CrmLeads/index";

// NFT Marketplace Pages
import Marketplace from "../pages/NFTMarketplace/Marketplace";
import Collections from "../pages/NFTMarketplace/Collections";
import CreateNFT from "../pages/NFTMarketplace/CreateNFT";
import Creators from "../pages/NFTMarketplace/Creators";
import ExploreNow from "../pages/NFTMarketplace/ExploreNow";
import ItemDetails from "../pages/NFTMarketplace/Itemdetails";
import LiveAuction from "../pages/NFTMarketplace/LiveAuction";
import Ranking from "../pages/NFTMarketplace/Ranking";
import WalletConnect from "../pages/NFTMarketplace/WalletConnect";

// Base Ui
import UiAlerts from "../pages/BaseUi/UiAlerts/UiAlerts";
import UiBadges from "../pages/BaseUi/UiBadges/UiBadges";
import UiButtons from "../pages/BaseUi/UiButtons/UiButtons";
import UiColors from "../pages/BaseUi/UiColors/UiColors";
import UiCards from "../pages/BaseUi/UiCards/UiCards";
import UiCarousel from "../pages/BaseUi/UiCarousel/UiCarousel";
import UiDropdowns from "../pages/BaseUi/UiDropdowns/UiDropdowns";
import UiGrid from "../pages/BaseUi/UiGrid/UiGrid";
import UiImages from "../pages/BaseUi/UiImages/UiImages";
import UiTabs from "../pages/BaseUi/UiTabs/UiTabs";
import UiAccordions from "../pages/BaseUi/UiAccordion&Collapse/UiAccordion&Collapse";
import UiModals from "../pages/BaseUi/UiModals/UiModals";
import UiOffcanvas from "../pages/BaseUi/UiOffcanvas/UiOffcanvas";
import UiPlaceholders from "../pages/BaseUi/UiPlaceholders/UiPlaceholders";
import UiProgress from "../pages/BaseUi/UiProgress/UiProgress";
import UiNotifications from "../pages/BaseUi/UiNotifications/UiNotifications";
import UiMediaobject from "../pages/BaseUi/UiMediaobject/UiMediaobject";
import UiEmbedVideo from "../pages/BaseUi/UiEmbedVideo/UiEmbedVideo";
import UiTypography from "../pages/BaseUi/UiTypography/UiTypography";
import UiList from "../pages/BaseUi/UiLists/UiLists";
import UiGeneral from "../pages/BaseUi/UiGeneral/UiGeneral";
import UiRibbons from "../pages/BaseUi/UiRibbons/UiRibbons";
import UiUtilities from "../pages/BaseUi/UiUtilities/UiUtilities";

// Advance Ui
import UiScrollbar from "../pages/AdvanceUi/UiScrollbar/UiScrollbar";
import UiAnimation from "../pages/AdvanceUi/UiAnimation/UiAnimation";
import UiSwiperSlider from "../pages/AdvanceUi/UiSwiperSlider/UiSwiperSlider";
import UiRatings from "../pages/AdvanceUi/UiRatings/UiRatings";
import UiHighlight from "../pages/AdvanceUi/UiHighlight/UiHighlight";

// Widgets
import Widgets from "../pages/Widgets/Index";

//Icon pages
import RemixIcons from "../pages/Icons/RemixIcons/RemixIcons";
import BoxIcons from "../pages/Icons/BoxIcons/BoxIcons";
import MaterialDesign from "../pages/Icons/MaterialDesign/MaterialDesign";
import FeatherIcons from "../pages/Icons/FeatherIcons/FeatherIcons";
import LineAwesomeIcons from "../pages/Icons/LineAwesomeIcons/LineAwesomeIcons";
import CryptoIcons from "../pages/Icons/CryptoIcons/CryptoIcons";



//AuthenticationInner pages
import BasicSignIn from "../pages/AuthenticationInner/Login/BasicSignIn";
import CoverSignIn from "../pages/AuthenticationInner/Login/CoverSignIn";
import BasicSignUp from "../pages/AuthenticationInner/Register/BasicSignUp";
import CoverSignUp from "../pages/AuthenticationInner/Register/CoverSignUp";
import BasicPasswReset from "../pages/AuthenticationInner/PasswordReset/BasicPasswReset";
//pages
import Starter from "../pages/Pages/Starter/Starter";
import SimplePage from "../pages/Pages/Profile/SimplePage/SimplePage";
import Settings from "../pages/Pages/Profile/Settings/Settings";
import Team from "../pages/Pages/Team/Team";
import Timeline from "../pages/Pages/Timeline/Timeline";
import Faqs from "../pages/Pages/Faqs/Faqs";
import Pricing from "../pages/Pages/Pricing/Pricing";
import Gallery from "../pages/Pages/Gallery/Gallery";
import Maintenance from "../pages/Pages/Maintenance/Maintenance";
import ComingSoon from "../pages/Pages/ComingSoon/ComingSoon";
import SiteMap from "../pages/Pages/SiteMap/SiteMap";
import SearchResults from "../pages/Pages/SearchResults/SearchResults";

import CoverPasswReset from "../pages/AuthenticationInner/PasswordReset/CoverPasswReset";
import BasicLockScreen from "../pages/AuthenticationInner/LockScreen/BasicLockScr";
import CoverLockScreen from "../pages/AuthenticationInner/LockScreen/CoverLockScr";
import BasicLogout from "../pages/AuthenticationInner/Logout/BasicLogout";
import CoverLogout from "../pages/AuthenticationInner/Logout/CoverLogout";
import BasicSuccessMsg from "../pages/AuthenticationInner/SuccessMessage/BasicSuccessMsg";
import CoverSuccessMsg from "../pages/AuthenticationInner/SuccessMessage/CoverSuccessMsg";
import BasicTwosVerify from "../pages/AuthenticationInner/TwoStepVerification/BasicTwosVerify";
import CoverTwosVerify from "../pages/AuthenticationInner/TwoStepVerification/CoverTwosVerify";
import Basic404 from "../pages/AuthenticationInner/Errors/Basic404";
import Cover404 from "../pages/AuthenticationInner/Errors/Cover404";
import Alt404 from "../pages/AuthenticationInner/Errors/Alt404";
import Error500 from "../pages/AuthenticationInner/Errors/Error500";

import BasicPasswCreate from "../pages/AuthenticationInner/PasswordCreate/BasicPasswCreate";
import CoverPasswCreate from "../pages/AuthenticationInner/PasswordCreate/CoverPasswCreate";
import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";

//APi Key
import APIKey from "../pages/APIKey/index";

//login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

//Charts
import LineCharts from "../pages/Charts/ApexCharts/LineCharts";
import AreaCharts from "../pages/Charts/ApexCharts/AreaCharts";
import ColumnCharts from "../pages/Charts/ApexCharts/ColumnCharts";
import BarCharts from "../pages/Charts/ApexCharts/BarCharts";
import MixedCharts from "../pages/Charts/ApexCharts/MixedCharts";
import TimelineCharts from "../pages/Charts/ApexCharts/TimelineCharts";
import CandlestickChart from "../pages/Charts/ApexCharts/CandlestickChart";
import BoxplotCharts from "../pages/Charts/ApexCharts/BoxplotCharts";
import BubbleChart from "../pages/Charts/ApexCharts/BubbleChart";
import ScatterCharts from "../pages/Charts/ApexCharts/ScatterCharts";
import HeatmapCharts from "../pages/Charts/ApexCharts/HeatmapCharts";
import TreemapCharts from "../pages/Charts/ApexCharts/TreemapCharts";
import PieCharts from "../pages/Charts/ApexCharts/PieCharts";
import RadialbarCharts from "../pages/Charts/ApexCharts/RadialbarCharts";
import RadarCharts from "../pages/Charts/ApexCharts/RadarCharts";
import PolarCharts from "../pages/Charts/ApexCharts/PolarCharts";
import ChartsJs from "../pages/Charts/ChartsJs/index";
import Echarts from "../pages/Charts/ECharts/index";

// Landing Index
import OnePage from "../pages/Landing/OnePage";
import NFTLanding from "../pages/Landing/NFTLanding";

import PrivecyPolicy from "../pages/Pages/PrivacyPolicy";
import TermsCondition from "../pages/Pages/TermsCondition";
import JobLanding from "../pages/Job_Landing/Job";

// User Profile
import UserProfile from "../pages/Authentication/user-profile";

import FileManager from "../pages/FileManager";
import UILink from "../pages/BaseUi/UiLink/Index";
import RangeArea from "../pages/Charts/ApexCharts/RangeAreaCharts/Index";
import FunnelCharts from "../pages/Charts/ApexCharts/FunnelCharts/Index";
import DashboardBlog from "pages/DashboardBlog";
import SlopeCharts from "pages/Charts/ApexCharts/SlopeCharts";
import BlogListView from "pages/Pages/Blogs/ListView";
import BlogGridView from "pages/Pages/Blogs/GridView";
import PageBlogOverview from "pages/Pages/Blogs/Overview";

const authProtectedRoutes = [
  { path: "/dashboard-analytics", component: <DashboardAnalytics /> },
  { path: "/dashboard-crm", component: <DashboardCrm /> },
  { path: "/dashboard", component: <DashboardEcommerce /> },
  { path: "/index", component: <DashboardEcommerce /> },
  { path: "/dashboard-crypto", component: <DashboardCrypto /> },
  { path: "/dashboard-projects", component: <DashboardProject /> },
  { path: "/dashboard-nft", component: <DashboardNFT /> },
  { path: "/dashboard-job", component: <DashboardJob /> },
  { path: "/dashboard-blog", component: <DashboardBlog /> },

  { path: "/briquette", component: <BriquetteDashboard /> },
  { path: "/briquette-audit", component: <BriquetteAuditList /> },
  { path: "/settings", component: <SettingsHub /> },

  { path: "/apps-calendar", component: <Calendar /> },
  { path: "/apps-calendar-month-grid", component: <MonthGrid /> },

  { path: "/apps-file-manager", component: <FileManager /> },


  //Chat
  { path: "/apps-chat", component: <Chat /> },

  //EMail
  { path: "/apps-mailbox", component: <MailInbox /> },
  { path: "/apps-email-basic", component: <BasicAction /> },
  { path: "/apps-email-ecommerce", component: <EcommerceAction /> },

  //Task

  //Api Key
  { path: "/apps-api-key", component: <APIKey /> },

  //Crm
  { path: "/apps-crm-contacts", component: <CrmContacts /> },
  { path: "/apps-crm-companies", component: <CrmCompanies /> },
  { path: "/apps-crm-deals", component: <CrmDeals /> },
  { path: "/apps-crm-leads", component: <CrmLeads /> },

  // NFT Marketplace
  { path: "/apps-nft-marketplace", component: <Marketplace /> },
  { path: "/apps-nft-collections", component: <Collections /> },
  { path: "/apps-nft-create", component: <CreateNFT /> },
  { path: "/apps-nft-creators", component: <Creators /> },
  { path: "/apps-nft-explore", component: <ExploreNow /> },
  { path: "/apps-nft-item-details", component: <ItemDetails /> },
  { path: "/apps-nft-auction", component: <LiveAuction /> },
  { path: "/apps-nft-ranking", component: <Ranking /> },
  { path: "/apps-nft-wallet", component: <WalletConnect /> },

  //charts
  { path: "/charts-apex-line", component: <LineCharts /> },
  { path: "/charts-apex-area", component: <AreaCharts /> },
  { path: "/charts-apex-column", component: <ColumnCharts /> },
  { path: "/charts-apex-bar", component: <BarCharts /> },
  { path: "/charts-apex-mixed", component: <MixedCharts /> },
  { path: "/charts-apex-timeline", component: <TimelineCharts /> },
  { path: "/charts-apex-range-area", component: <RangeArea /> },
  { path: "/charts-apex-funnel", component: <FunnelCharts /> },
  { path: "/charts-apex-candlestick", component: <CandlestickChart /> },
  { path: "/charts-apex-boxplot", component: <BoxplotCharts /> },
  { path: "/charts-apex-bubble", component: <BubbleChart /> },
  { path: "/charts-apex-scatter", component: <ScatterCharts /> },
  { path: "/charts-apex-heatmap", component: <HeatmapCharts /> },
  { path: "/charts-apex-treemap", component: <TreemapCharts /> },
  { path: "/charts-apex-pie", component: <PieCharts /> },
  { path: "/charts-apex-radialbar", component: <RadialbarCharts /> },
  { path: "/charts-apex-radar", component: <RadarCharts /> },
  { path: "/charts-apex-polar", component: <PolarCharts /> },
  { path: "/charts-apex-slope", component: <SlopeCharts /> },

  { path: "/charts-chartjs", component: <ChartsJs /> },
  { path: "/charts-echarts", component: <Echarts /> },

  // Base Ui
  { path: "/ui-alerts", component: <UiAlerts /> },
  { path: "/ui-badges", component: <UiBadges /> },
  { path: "/ui-buttons", component: <UiButtons /> },
  { path: "/ui-colors", component: <UiColors /> },
  { path: "/ui-cards", component: <UiCards /> },
  { path: "/ui-carousel", component: <UiCarousel /> },
  { path: "/ui-dropdowns", component: <UiDropdowns /> },
  { path: "/ui-grid", component: <UiGrid /> },
  { path: "/ui-images", component: <UiImages /> },
  { path: "/ui-tabs", component: <UiTabs /> },
  { path: "/ui-accordions", component: <UiAccordions /> },
  { path: "/ui-modals", component: <UiModals /> },
  { path: "/ui-offcanvas", component: <UiOffcanvas /> },
  { path: "/ui-placeholders", component: <UiPlaceholders /> },
  { path: "/ui-progress", component: <UiProgress /> },
  { path: "/ui-notifications", component: <UiNotifications /> },
  { path: "/ui-media", component: <UiMediaobject /> },
  { path: "/ui-embed-video", component: <UiEmbedVideo /> },
  { path: "/ui-typography", component: <UiTypography /> },
  { path: "/ui-lists", component: <UiList /> },
  { path: "/ui-links", component: <UILink /> },
  { path: "/ui-general", component: <UiGeneral /> },
  { path: "/ui-ribbons", component: <UiRibbons /> },
  { path: "/ui-utilities", component: <UiUtilities /> },

  // Advance Ui
  { path: "/advance-ui-scrollbar", component: <UiScrollbar /> },
  { path: "/advance-ui-animation", component: <UiAnimation /> },
  { path: "/advance-ui-swiper", component: <UiSwiperSlider /> },
  { path: "/advance-ui-ratings", component: <UiRatings /> },
  { path: "/advance-ui-highlight", component: <UiHighlight /> },

  // Widgets
  { path: "/widgets", component: <Widgets /> },

  //Icons
  { path: "/icons-remix", component: <RemixIcons /> },
  { path: "/icons-boxicons", component: <BoxIcons /> },
  { path: "/icons-materialdesign", component: <MaterialDesign /> },
  { path: "/icons-feather", component: <FeatherIcons /> },
  { path: "/icons-lineawesome", component: <LineAwesomeIcons /> },
  { path: "/icons-crypto", component: <CryptoIcons /> },

  
  { path: "/pages-starter", component: <Starter /> },
  { path: "/pages-profile", component: <SimplePage /> },
  { path: "/pages-profile-settings", component: <Settings /> },
  { path: "/pages-team", component: <Team /> },
  { path: "/pages-timeline", component: <Timeline /> },
  { path: "/pages-faqs", component: <Faqs /> },
  { path: "/pages-gallery", component: <Gallery /> },
  { path: "/pages-pricing", component: <Pricing /> },
  { path: "/pages-sitemap", component: <SiteMap /> },
  { path: "/pages-search-results", component: <SearchResults /> },
  { path: "/pages-privacy-policy", component: <PrivecyPolicy /> },
  { path: "/pages-terms-condition", component: <TermsCondition /> },
  { path: "/pages-blog-list", component: <BlogListView /> },
  { path: "/pages-blog-grid", component: <BlogGridView /> },
  { path: "/pages-blog-overview", component: <PageBlogOverview /> },

  //User Profile
  { path: "/profile", component: <UserProfile /> },

  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes: any = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },

  //AuthenticationInner pages
  { path: "/auth-signin-basic", component: <BasicSignIn /> },
  { path: "/auth-signin-cover", component: <CoverSignIn /> },
  { path: "/auth-signup-basic", component: <BasicSignUp /> },
  { path: "/auth-signup-cover", component: <CoverSignUp /> },
  { path: "/auth-pass-reset-basic", component: <BasicPasswReset /> },
  { path: "/auth-pass-reset-cover", component: <CoverPasswReset /> },
  { path: "/auth-lockscreen-basic", component: <BasicLockScreen /> },
  { path: "/auth-lockscreen-cover", component: <CoverLockScreen /> },
  { path: "/auth-logout-basic", component: <BasicLogout /> },
  { path: "/auth-logout-cover", component: <CoverLogout /> },
  { path: "/auth-success-msg-basic", component: <BasicSuccessMsg /> },
  { path: "/auth-success-msg-cover", component: <CoverSuccessMsg /> },
  { path: "/auth-twostep-basic", component: <BasicTwosVerify /> },
  { path: "/auth-twostep-cover", component: <CoverTwosVerify /> },
  { path: "/auth-404-basic", component: <Basic404 /> },
  { path: "/auth-404-cover", component: <Cover404 /> },
  { path: "/auth-404-alt", component: <Alt404 /> },
  { path: "/auth-500", component: <Error500 /> },
  { path: "/pages-maintenance", component: <Maintenance /> },
  { path: "/pages-coming-soon", component: <ComingSoon /> },

  { path: "/landing", component: <OnePage /> },
  { path: "/nft-landing", component: <NFTLanding /> },
  { path: "/job-landing", component: <JobLanding /> },

  { path: "/auth-pass-change-basic", component: <BasicPasswCreate /> },
  { path: "/auth-pass-change-cover", component: <CoverPasswCreate /> },
  { path: "/auth-offline", component: <Offlinepage /> },
];

export { authProtectedRoutes, publicRoutes };
