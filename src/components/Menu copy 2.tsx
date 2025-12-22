import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const AUTH_DISABLED = process.env.DISABLE_AUTH === "true";

const menuItems = [
  {
    title: "MENU",
    items: [
      { icon: "/home.png", label: "Home", href: "/", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/teacher.png", label: "Professores", href: "/list/teachers", visible: ["admin", "teacher"] },
      { icon: "/student.png", label: "Alunos", href: "/list/students", visible: ["admin", "teacher"] },
      { icon: "/parent.png", label: "Responsáveis", href: "/list/parents", visible: ["admin", "teacher"] },
      { icon: "/course.png", label: "Série", href: "/list/grades", visible: ["admin", "teacher"] },
      { icon: "/subject.png", label: "Discíplinas", href: "/list/subjects", visible: ["admin"] },
      { icon: "/class.png", label: "Turmas", href: "/list/classes", visible: ["admin", "teacher"] },
      { icon: "/lesson.png", label: "Lições", href: "/list/lessons", visible: ["admin", "teacher"] },
      { icon: "/exam.png", label: "Testes/Provas", href: "/list/exams", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/assignment.png", label: "Tarefas", href: "/list/assignments", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/result.png", label: "Resultados", href: "/list/results", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/attendance.png", label: "Presença", href: "/list/attendances", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/calendar.png", label: "Eventos", href: "/list/events", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/message.png", label: "Menssages", href: "/list/messages", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/announcement.png", label: "Anúncios", href: "/list/announcements", visible: ["admin", "teacher", "student", "parent"] },
    ],
  },
  {
    title: "OUTROS",
    items: [
      { icon: "/profile.png", label: "Perfís", href: "/profile", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/setting.png", label: "Ajustes", href: "/settings", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/logout.png", label: "Sair", href: "/logout", visible: ["admin", "teacher", "student", "parent"] },
    ],
  },
];

const Menu = async () => {
  let role: string | undefined;

  if (AUTH_DISABLED) {
    // 🔓 bypass total
    role = "admin";
  } else {
    const user = await currentUser();
    role = user?.publicMetadata?.role as string | undefined;
  }

  if (!role) return null;

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>

          {section.items
            .filter((item) => item.visible.includes(role!))
            .map((item) => (
              <Link
                href={item.href}
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
              >
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
