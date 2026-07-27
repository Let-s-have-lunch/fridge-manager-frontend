export default function DiaryScreen() {
    const router = useRouter();

    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const [diaries, setDiaries] = useState<Diary[]>([]);
    const [todos, setTodos] = useState<Todo[]>([]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const getDaysInMonthGrid = (targetYear: number, targetMonth: number) => {
        const firstDayOfMonth = new Date(targetYear, targetMonth, 1);
        const lastDayOfMonth = new Date(targetYear, targetMonth + 1, 0);

        const firstDayOfWeek = firstDayOfMonth.getDay();
        const grid: Date[] = [];

        const prevMonthLastDay = new Date(targetYear, targetMonth, 0).getDate();
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            grid.push(new Date(targetYear, targetMonth - 1, prevMonthLastDay - i));
        }

        const totalDays = lastDayOfMonth.getDate();
        for (let i = 1; i <= totalDays; i++) {
            grid.push(new Date(targetYear, targetMonth, i));
        }

        const remaining = 42 - grid.length;
        for (let i = 1; i <= remaining; i++) {
            grid.push(new Date(targetYear, targetMonth + 1, i));
        }

        return grid;
    };

    const calendarGrid = getDaysInMonthGrid(year, month);
    const selectedDateStr = formattingUtil.formatDateString(selectedDate);

    const isSameDate = (dbDate: string | Date, targetDateStr: string) => {
        try {
            const d = new Date(dbDate);
            return formattingUtil.formatDateString(d) === targetDateStr;
        } catch {
            return false;
        }
    };

    const fetchData = useCallback(async (start: string, end: string) => {
        try {
            const [diaryList, todoList] = await Promise.all([
                diaryApi.getDiaryListByRange(start, end).catch(() => [] as Diary[]),
                todoApi.getTodoListByRange(start, end).catch(() => [] as Todo[]),
            ]);
            setDiaries(diaryList);
            setTodos(todoList);
        } catch (error) {
            console.error("데이터 로드 실패:", error);
        } finally {
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            const grid = getDaysInMonthGrid(year, month);
            const startStr = formattingUtil.formatDateString(grid[0]);
            const endStr = formattingUtil.formatDateString(grid[grid.length - 1]);
            void fetchData(startStr, endStr);
        }, [year, month, fetchData]),
    );

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const WEEKDAYS = [
        {
            label: "sun",
            textClass: "text-text-default",
            bgClass: "bg-error-main border-error-main",
        },
        {
            label: "mon",
            textClass: "text-text-default",
            bgClass: "bg-background-paper border-divider",
        },
        {
            label: "tue",
            textClass: "text-text-default",
            bgClass: "bg-background-paper border-divider",
        },
        {
            label: "wed",
            textClass: "text-text-default",
            bgClass: "bg-background-paper border-divider",
        },
        {
            label: "thu",
            textClass: "text-text-default",
            bgClass: "bg-background-paper border-divider",
        },
        {
            label: "fri",
            textClass: "text-text-default",
            bgClass: "bg-background-paper border-divider",
        },
        {
            label: "sat",
            textClass: "text-text-default",
            bgClass: "bg-secondary-main border-secondary-main",
        },
    ];

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row justify-center items-center mb-6">
                <TouchableOpacity onPress={handlePrevMonth} className="p-2">
                    <Feather
                        name="chevron-left"
                        size={20}
                        className="text-text-default font-bold"
                    />
                </TouchableOpacity>
                <TextComponent className="text-xl font-bold text-text-default px-4">
                    {year}년 {month + 1}월
                </TextComponent>
                <TouchableOpacity onPress={handleNextMonth} className="p-2">
                    <Feather
                        name="chevron-right"
                        size={20}
                        className="text-text-default font-bold"
                    />
                </TouchableOpacity>
            </View>

            <View className="flex-row justify-between mb-3">
                {WEEKDAYS.map((day, idx) => (
                    <View
                        key={idx}
                        className={`w-[13%] py-1.5 items-center justify-center rounded-lg border ${day.bgClass}`}>
                        <TextComponent className={`text-xs font-bold ${day.textClass}`}>
                            {day.label}
                        </TextComponent>
                    </View>
                ))}
            </View>

            <View className="flex-row flex-wrap justify-between gap-y-2">
                {calendarGrid.map((day, idx) => {
                    const isCurrentMonth = day.getMonth() === month;
                    const isSunday = day.getDay() === 0;
                    const isSaturday = day.getDay() === 6;
                    const dateStr = formattingUtil.formatDateString(day);

                    const isSelected = dateStr === selectedDateStr;
                    const isToday = dateStr === formattingUtil.formatDateString(new Date());

                    let dayTextClass = "text-text-default font-semibold";
                    if (isSelected) {
                        dayTextClass = "text-primary-contrast font-bold";
                    } else if (!isCurrentMonth) {
                        dayTextClass = "text-text-secondary opacity-50";
                    } else if (isSunday) {
                        dayTextClass = "text-error-point font-bold";
                    } else if (isSaturday) {
                        dayTextClass = "text-secondary-point font-bold";
                    }

                    const hasDiary = diaries.some(d => isSameDate(d.date, dateStr));
                    const hasTodo = todos.some(t => isSameDate(t.date, dateStr));

                    return (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => {
                                setSelectedDate(day);
                                router.push(`/diary/list?date=${dateStr}`);
                            }}
                            activeOpacity={0.7}
                            className={`w-[13%] aspect-[1/1.8] rounded-[10px] items-center pt-2 ${
                                isSelected
                                    ? "bg-primary-main"
                                    : isToday
                                        ? "bg-primary-light"
                                        : isCurrentMonth
                                            ? "bg-background-paper"
                                            : "bg-transparent"
                            }`}>
                            <TextComponent className={`text-[13px] ${dayTextClass}`}>
                                {day.getDate()}
                            </TextComponent>

                            <View className="flex-row justify-center items-center gap-1 mt-2">
                                {hasTodo && (
                                    <View className="w-3 h-3 rounded-full bg-error-main" />
                                )}

                                {hasDiary && (
                                    <View className="w-3 h-3 rounded-full bg-secondary-main" />
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
}