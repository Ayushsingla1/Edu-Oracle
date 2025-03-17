
function QuickAction({ icon: Icon, label, onClick }) {
    console.log(label);
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-700/50 transition-all"
    >
      <Icon className="w-4 h-4 text-emerald-400" />
      <span className="text-sm text-gray-200">{label}</span>
    </button>
);
}

export default QuickAction;