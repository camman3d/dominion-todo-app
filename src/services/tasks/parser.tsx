interface TaskMetadata {
    dueDate: Date | null;
    location: string;
    categories: string[];
    priority: number;
    cleanDescription: string;
}

export default class TaskParser {
    private static readonly DATE_KEYWORDS = [
        'today',
        'tomorrow',
        'next',
        'this',
    ];

    private static readonly DAYS = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
    ];

    private static readonly MONTHS = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];

    private static readonly PRIORITY_MAP: Record<string, number> = {
        critical: 1,
        urgent: 2,
        high: 3,
        mid: 4,
        low: 5,
        note: 6,
    }

    parseTask(description: string): TaskMetadata {
        const metadata: TaskMetadata = {
            dueDate: null,
            location: '',
            categories: [],
            priority: 0,
            cleanDescription: description,
        };

        // Extract category (#tag)
        const categoryMatches = description.matchAll(/#(\w+)/g);
        for (const match of categoryMatches) {
            metadata.categories.push(match[1]);
            metadata.cleanDescription = metadata.cleanDescription.replace(match[0], '').trim();
        }

        // Extract priority (!priority)
        const priorityMatch = description.match(/!(\w+)/);
        if (priorityMatch) {
            const priorityStr = priorityMatch[1].toLowerCase();
            metadata.priority = TaskParser.PRIORITY_MAP[priorityStr] || 0;
            metadata.cleanDescription = metadata.cleanDescription.replace(priorityMatch[0], '').trim();
        }

        // Extract location (@location)
        const locationMatch = description.match(/@(\w+)/);
        if (locationMatch) {
            metadata.location = locationMatch[1].toLowerCase();
            metadata.cleanDescription = metadata.cleanDescription.replace(locationMatch[0], '').trim();
        }

        // Extract date and time
        metadata.dueDate = this.extractDate(description);

        return metadata;
    }

    private extractDate(description: string): Date | null {
        const lowerDesc = description.toLowerCase();
        const words = lowerDesc.split(' ');
        let date: Date | null = null;

        // First try to match explicit date patterns

        // Match "MM/DD" or "MM/DD/YYYY"
        const slashDateMatch = description.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/);
        if (slashDateMatch) {
            const month = parseInt(slashDateMatch[1]) - 1;
            const day = parseInt(slashDateMatch[2]);
            const year = slashDateMatch[3] ? parseInt(slashDateMatch[3]) : new Date().getFullYear();
            date = new Date(year, month, day);
        }

        // Match "Month DD" or "Month DD, YYYY"
        const monthDayMatch = description.match(
            new RegExp(`(${TaskParser.MONTHS.join('|')})\\s+(\\d{1,2})(?:,?\\s+(\\d{4}))?`, 'i')
        );
        if (monthDayMatch) {
            const month = TaskParser.MONTHS.indexOf(monthDayMatch[1].toLowerCase());
            const day = parseInt(monthDayMatch[2]);
            const year = monthDayMatch[3] ? parseInt(monthDayMatch[3]) : new Date().getFullYear();
            date = new Date(year, month, day);
        }

        // If no explicit date found, try relative dates
        if (!date) {
            for (let i = 0; i < words.length; i++) {
                const word = words[i];

                // Check for today/tomorrow
                if (word === 'today') {
                    date = new Date();
                } else if (word === 'tomorrow') {
                    date = new Date();
                    date.setDate(date.getDate() + 1);
                }

                // Check for day names (e.g., "this friday" or "next monday")
                const dayIndex = TaskParser.DAYS.indexOf(word);
                if (dayIndex !== -1) {
                    const prevWord = i > 0 ? words[i - 1] : '';
                    if (TaskParser.DATE_KEYWORDS.includes(prevWord)) {
                        const today = new Date();
                        const targetDay = dayIndex;
                        const currentDay = today.getDay();
                        let daysToAdd = targetDay - currentDay;

                        if (prevWord === 'next' || daysToAdd <= 0) {
                            daysToAdd += 7;
                        }

                        date = new Date();
                        date.setDate(today.getDate() + daysToAdd);
                    }
                }
            }
        }

        // If we found a date, try to add time if specified
        if (date) {
            // Match "at HH:MM" or "at H:MM" or "at H" or "at HH" (both 12-hour and 24-hour formats)
            const timeMatch = description.match(/at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
            if (timeMatch) {
                let hours = parseInt(timeMatch[1]);
                const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
                const meridiem = timeMatch[3]?.toLowerCase();

                // Handle 12-hour format
                if (meridiem) {
                    if (meridiem === 'pm' && hours < 12) hours += 12;
                    if (meridiem === 'am' && hours === 12) hours = 0;
                }

                date.setHours(hours, minutes, 0, 0);
            } else {
                // If no time specified, set to start of day
                date.setHours(0, 0, 0, 0);
            }
        }

        return date;
    }
}