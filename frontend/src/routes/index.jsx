import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import Faculty from "../pages/admin/Faculty";
import KnowledgeAreas from "../pages/admin/KnowledgeAreas";
import NotFound from "../pages/NotFound";
import SignIn from "../pages/SignIn";
import Home from "../pages/user/Home";
import Curriculum from "../pages/user/Curriculum";
import CurriculumFramework from "../pages/admin/CurriculumFramework";
import GeneralInformation from "../pages/admin/GeneralInformation";
import Course from "../pages/admin/Course";
import CourseList from "../pages/admin/CourseList";
import CourseOutline from "../pages/admin/CourseOutline";
import TeachingPlan from "../pages/admin/TeachingPlan";
import Lecturer from "../pages/admin/Lecturer";
import GroupOpeningPlan from "../pages/admin/GroupOpeningPlan";
import TeachingAssignment from "../pages/admin/TeachingAssignment";
import TrainingCycle from "../pages/admin/TrainingCycle";
import CreateTrainingCycle from "../pages/admin/CreateTrainingCycle";
import EditTrainingCycle from "../pages/admin/EditTrainingCycle";
import CreateGroupOpeningPlan from "../pages/admin/CreateGroupOpeningPlan";
import Assignment from "../pages/admin/Assignment";
import CreateTeachingAssignment from "../pages/admin/CreateTeachingAssignment";
import DetailGroupOpeningPlan from "../pages/admin/DetailGroupOpeningPlan";
import EditGroupOpeningPlan from "../pages/admin/EditGroupOpeningPlan";
import CourseOutlineDetail from "../pages/admin/CourseOulineDetail";
import CurriculumFrameworkDetail from "../pages/admin/CurriculumFrameworkDetail";
import LecturerStatistics from "../pages/admin/LecturerStatistics";
import { Navigate } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/", //Phần chung user và artist
        element: <UserLayout />, // Layout chung
        children: [
            { path: "", element: <Home /> },
            { path: "curriculum", element: <Curriculum /> },
        ],
    },
    {
        path: "/sign-in",
        element: <SignIn />
    },
    {
        path: "/admin", //Phần quản lí của quyền quản trị
        element: <AdminLayout />,
        children: [
            {
                index: true, // Khi path là đúng "/admin"
                element: <Navigate to="faculty" replace />, // ✅ Redirect sang /admin/faculty
            },
            { path: "faculty", element: <Faculty /> },
            { path: "knowledge-areas", element: <KnowledgeAreas /> },
            { path: "curriculum-framework", element: <CurriculumFramework /> },
            { path: "curriculum-framework/:generalInformationId", element: <CurriculumFrameworkDetail /> },
            { path: "general-information", element: <GeneralInformation /> },
            { path: "course", element: <Course /> },
            { path: "course-list", element: <CourseList /> },
            { path: "course-outline", element: <CourseOutline /> },
            { path: "course-outline/:id", element: <CourseOutlineDetail /> },
            { path: "teaching-plan", element: <TeachingPlan /> },
            { path: "lecturer", element: <Lecturer /> },
            { path: "lecturer/statistics", element: <LecturerStatistics /> },
            { path: "group-opening-plan", element: <GroupOpeningPlan /> },
            { path: "group-opening-plan/create", element: <CreateGroupOpeningPlan /> },
            { path: "group-opening-plan/detail/:id", element: <DetailGroupOpeningPlan /> },
            { path: "group-opening-plan/edit/:id", element: <EditGroupOpeningPlan /> },
            { path: "teaching-assignment", element: <TeachingAssignment /> },
            { path: "teaching-assignment/assignment", element: <Assignment /> },
            { path: "teaching-assignment/assignment/create", element: <CreateTeachingAssignment /> },
            { path: "training-cycle", element: <TrainingCycle /> },
            { path: "training-cycle/create", element: <CreateTrainingCycle /> },
            { path: "training-cycle/edit/:id", element: <EditTrainingCycle /> },

        ],
    },
    { path: "*", element: <NotFound /> },
]);

export default router;

