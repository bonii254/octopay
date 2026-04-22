import React from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../Components/Hooks/useAuth"; // adjust path

const Navdata = () => {
    const history = useNavigate();
    const { data: user } = useUser();

    const role = user?.role;

    const roleAccess: Record<string, string[]> = {
        ATTENDANT: ["blog", "briquette", "fuel", "reports"],
        QAE: ["blog", "briquette-audit", "fuel-audit", "settings", "reports"],
        SUPERADMIN: [
            "blog",
            "briquette",
            "briquette-audit",
            "fuel",
            "fuel-audit",
            "settings",
            "reports",
        ],
    };

    const allowedItems = roleAccess[role as keyof typeof roleAccess] || [];

    const dashboardItems = [
        {
            id: "blog",
            label: "Blog",
            icon: "ri-article-line",
            link: "/dashboard-blog",
            badgeColor: "success",
            badgeName: "New",
        },
        {
            id: "briquette",
            label: "Briquette Inventory",
            icon: "ri-stack-line",
            link: "/briquette",
        },
        {
            id: "briquette-audit",
            label: "Briquette Audit",
            icon: "ri-search-eye-line",
            link: "/briquette-audit",
        },
        {
            id: "fuel",
            label: "Fuel Inventory",
            icon: "ri-drop-line",
            link: "/fuel",
        },
        {
            id: "fuel-audit",
            label: "Fuel Audit",
            icon: "ri-file-search-line",
            link: "/fuel-audit",
        },
        {
            id: "settings",
            label: "Settings",
            icon: "ri-settings-3-line",
            link: "/settings",
            badgeColor: "danger",
        },
        {
            id: "reports",
            label: "Reports",
            icon: "ri-bar-chart-line",
            link: "/reports",
            badgeColor: "danger",
        },
    ];

    const filteredDashboardItems =
        role === "SUPERADMIN"
            ? dashboardItems
            : dashboardItems.filter((item) =>
                  allowedItems.includes(item.id)
              );

    const menuItems: any = [
        {
            label: "Menu",
            isHeader: true,
        },

        ...filteredDashboardItems,
    ];

    return <React.Fragment>{menuItems}</React.Fragment>;
};

export default Navdata;