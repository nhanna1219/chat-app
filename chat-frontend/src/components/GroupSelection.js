const GroupSelection = ({ availableGroups, selectedGroup, setGroup }) => {
    return (
        <div className="mb-4">
            <h3 className="text-gray-700 font-semibold mb-2">Select a Group:</h3>
            <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black"
                value={selectedGroup}
                onChange={(e) => {
                    setGroup(e.target.value);

                    // Auto focus chat input
                    const chatInput = document.getElementById("chat-input");
                    if (chatInput) {
                        chatInput.focus();
                    }
                }}
            >
                {availableGroups.map((group) => (
                    <option key={group} value={group}>
                        {group.charAt(0).toUpperCase() + group.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default GroupSelection;
