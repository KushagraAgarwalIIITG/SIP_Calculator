import { fireEvent, render, screen } from '@testing-library/react';
import { MilestoneModal } from '../src/components/MilestoneModal';

describe('MilestoneModal', () => {
  it('does not render when closed', () => {
    const { container } = render(
      <MilestoneModal
        isOpen={false}
        onClose={vi.fn()}
        milestones={[]}
        onMilestonesChange={vi.fn()}
        minAge={25}
        maxAge={60}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('adds a milestone and calls onMilestonesChange', () => {
    const onMilestonesChange = vi.fn();
    render(
      <MilestoneModal
        isOpen
        onClose={vi.fn()}
        milestones={[]}
        onMilestonesChange={onMilestonesChange}
        minAge={25}
        maxAge={60}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('e.g., Marriage, First Child'), {
      target: { value: 'House' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add milestone/i }));

    expect(onMilestonesChange).toHaveBeenCalledTimes(1);
    const [[updated]] = onMilestonesChange.mock.calls;
    expect(updated).toHaveLength(1);
    expect(updated[0].label).toBe('House');
    expect(updated[0].age).toBe(25);
  });

  it('removes an existing milestone', () => {
    const onMilestonesChange = vi.fn();
    const milestones = [
      { id: 'm1', age: 30, label: 'Wedding', color: '#a855f7' },
    ];

    render(
      <MilestoneModal
        isOpen
        onClose={vi.fn()}
        milestones={milestones}
        onMilestonesChange={onMilestonesChange}
        minAge={25}
        maxAge={60}
      />
    );

    const deleteButtons = screen.getAllByRole('button');
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);

    expect(onMilestonesChange).toHaveBeenCalledWith([]);
  });
});
