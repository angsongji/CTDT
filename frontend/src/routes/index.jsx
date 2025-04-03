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
            { path: "", element: <Faculty /> },
            { path: "knowledge-areas", element: <KnowledgeAreas /> },
            { path: "curriculum-framework", element: <CurriculumFramework /> },
            { path: "general-information", element: <GeneralInformation /> },
            { path: "course", element: <Course /> },
            { path: "course-list", element: <CourseList /> },
            { path: "course-outline", element: <CourseOutline /> },
            { path: "teaching-plan", element: <TeachingPlan /> },
            { path: "lecturer", element: <Lecturer /> },
            { path: "group-opening-plan", element: <GroupOpeningPlan /> },
            { path: "teaching-assignment", element: <TeachingAssignment /> },
            { path: "training-cycle", element: <TrainingCycle /> },
            { path: "training-cycle/create", element: <CreateTrainingCycle /> },
        ],
    },
    { path: "*", element: <NotFound /> },
]);

export default router;

