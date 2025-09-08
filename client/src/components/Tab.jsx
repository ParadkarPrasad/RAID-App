import { NavLink, useParams } from "react-router-dom"

export default function Tab() {
  const { projectId } = useParams()

  const tabs = [
    { name: "Risks", path: "risks" },
    { name: "Assumptions", path: "assumptions" },
    { name: "Issues", path: "issues" },
    { name: "Dependencies", path: "dependencies" },
  ]

  return (
    <nav className="mt-4 flex justify-center gap-3 bg-gray-100 rounded-md p-2">
      {tabs.map(tab => (
        <NavLink
          key={tab.path}
          to={`/projects/${projectId}/${tab.path}`}
          end
          className={({ isActive }) =>
            `px-4 py-2 text-sm font-medium rounded-md transition
             ${isActive
              ? "bg-white text-blue-600 shadow border border-gray-200"
              : "text-gray-600 hover:bg-gray-200"}`
          }
        >
          {tab.name}
        </NavLink>
      ))}
    </nav>
  )
}
