interface DifficultyBadgeProps {
    difficulty: string;
  }

  const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
    const getDifficultyColorClass = (difficulty: string) => {
      switch (difficulty) {
        case 'easy':
          return 'bg-green-600';
        case 'medium':
          return 'bg-yellow-600';
        case 'hard':
          return 'bg-red-600';
        default:
          return 'bg-gray-500';
      }
    };

    return (
      <div
        className={`text-[12px] sm:text-[14px] md:text-s text-white rounded px-0.5 md:px-1 inline-block ${getDifficultyColorClass(
          difficulty
        )}`}
      >
        {difficulty}
      </div>
    );
  };

export default DifficultyBadge;
