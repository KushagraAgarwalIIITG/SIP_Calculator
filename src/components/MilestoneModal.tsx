import  { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export interface Milestone {
  id: string;
  age: number;
  label: string;
  color: string;
}

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestones: Milestone[];
  onMilestonesChange: (milestones: Milestone[]) => void;
  minAge: number;
  maxAge: number;
}

const colorOptions = [
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Teal', value: '#14b8a6' },
];

export function MilestoneModal({
  isOpen,
  onClose,
  milestones,
  onMilestonesChange,
  minAge,
  maxAge
}: MilestoneModalProps) {
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    age: minAge,
    label: '',
    color: colorOptions[0].value
  });

  const handleAddMilestone = () => {
    if (newMilestone.label && newMilestone.age) {
      const milestone: Milestone = {
        id: Date.now().toString(),
        age: newMilestone.age,
        label: newMilestone.label,
        color: newMilestone.color || colorOptions[0].value
      };
      onMilestonesChange([...milestones, milestone].sort((a, b) => a.age - b.age));
      setNewMilestone({
        age: minAge,
        label: '',
        color: colorOptions[0].value
      });
    }
  };

  const handleRemoveMilestone = (id: string) => {
    onMilestonesChange(milestones.filter((m) => m.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Life Milestones</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p className="text-sm text-blue-800">
              Add life milestones to visualize key events on your growth chart
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                value={newMilestone.age}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, age: parseInt(e.target.value) || minAge })
                }
                min={minAge}
                max={maxAge}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label
              </label>
              <input
                type="text"
                value={newMilestone.label}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, label: e.target.value })
                }
                placeholder="e.g., Marriage, First Child"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setNewMilestone({ ...newMilestone, color: color.value })}
                    className={`w-full h-8 rounded-lg border-2 transition-all ${
                      newMilestone.color === color.value
                        ? 'border-gray-900 shadow-md'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleAddMilestone}
              disabled={!newMilestone.label}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Plus size={18} />
              Add Milestone
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-medium text-gray-900 mb-3">Added Milestones</h3>
            <div className="space-y-2">
              {milestones.length === 0 ? (
                <p className="text-sm text-gray-500">No milestones added yet</p>
              ) : (
                milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: milestone.color }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{milestone.label}</p>
                        <p className="text-sm text-gray-600">Age {milestone.age}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMilestone(milestone.id)}
                      className="p-1 hover:bg-red-100 rounded transition-colors text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
