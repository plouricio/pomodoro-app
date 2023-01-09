import { FormControl } from "@angular/forms";

export interface UserConfig{
    pomodoroTimer: FormControl<number>;
    shortBreakTimer: FormControl<number>;
    longBreakTimer: FormControl<number>;
}