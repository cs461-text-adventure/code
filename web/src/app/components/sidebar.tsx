export default function Sidebar() {
  return (
    <div className="flex-1 border border-gray-200 md:rounded-lg bg-white flex flex-col text-left text-sm p-4 h-full">
      <button className="p-2 rounded-lg hover:bg-slate-100 text-left">
        Password and authentication
      </button>
      <button className="p-2 rounded-lg hover:bg-slate-100 text-left">
        Sessions
      </button>
    </div>
  );
}
