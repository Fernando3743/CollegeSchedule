import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  GraduationCap,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  mobileLabel: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", mobileLabel: "Home", icon: LayoutDashboard },
  { href: "/schedule", label: "Schedule", mobileLabel: "Schedule", icon: Calendar },
  { href: "/courses", label: "Courses", mobileLabel: "Courses", icon: BookOpen },
  { href: "/semesters", label: "Semesters", mobileLabel: "Semesters", icon: GraduationCap },
  { href: "/grades", label: "Grades", mobileLabel: "Grades", icon: BarChart3 },
];
