import ProgressBar from '@/components/game/progress-bar';

export default function ExperienceBar({
    level,
    experience,
    requiredExperience,
}: {
    level: number;
    experience: number;
    requiredExperience: number;
}) {
    return (
        <div className="space-y-1">
            <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold">Level {level}</span>
                <span className="text-sm font-semibold text-muted-foreground">
                    {experience} / {requiredExperience} XP
                </span>
            </div>

            <ProgressBar
                value={experience}
                max={requiredExperience}
                colorClass="bg-xp"
                label="Experience"
            />
        </div>
    );
}
