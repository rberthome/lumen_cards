declare namespace App.Enums {
export type CardDifficulty = 'easy' | 'medium' | 'hard';
export type PresentationMode = 'two_choices' | 'four_choices' | 'open';
export type UserLevel = 'apprentice' | 'companion' | 'master' | 'grand_master';
}
declare namespace App.Repositories.Auth.DTOs {
export type MeDto = {
id: number;
name: string;
email: string;
role_slug: string | null;
role_name: string | null;
permissions: Array<string>;
};
}
declare namespace App.Repositories.Card.DTOs {
export type AdminCardDto = {
id: number;
deck_id: number;
deck_title: string;
front: string;
back: string;
wrong_answer_1: string | null;
wrong_answer_2: string | null;
wrong_answer_3: string | null;
explanation: string | null;
source: string | null;
tags: Array<any>;
difficulty: string;
progression_config: Array<any>;
created_at: string;
};
export type CardDto = {
id: number;
deck_id: number;
front: string;
back: string;
explanation: string | null;
source: string | null;
tags: Array<any>;
difficulty: string;
};
export type CardWithProgressDto = {
id: number;
deck_id: number;
front: string;
back: string;
wrong_answer_1: string | null;
wrong_answer_2: string | null;
wrong_answer_3: string | null;
explanation: string | null;
source: string | null;
tags: Array<any>;
difficulty: string;
interval: number;
repetition: number;
ease_factor: number;
next_review_at: string | null;
show_choices: boolean;
};
}
declare namespace App.Repositories.Category.DTOs {
export type CategoryDto = {
id: number;
name: string;
slug: string;
description: string | null;
cover_emoji: string | null;
sort_order: number;
deck_count: number;
};
}
declare namespace App.Repositories.Deck.DTOs {
export type AdminDeckDto = {
id: number;
category_id: number | null;
category_name: string | null;
title: string;
description: string | null;
cover_emoji: string | null;
is_published: boolean;
card_count: number;
created_at: string;
};
export type DeckDto = {
id: number;
user_id: number | null;
title: string;
description: string | null;
category_id: number | null;
category_name: string | null;
card_count: number;
due_today: number;
cover_emoji: string | null;
created_at: string;
};
}
declare namespace App.Repositories.Review.DTOs {
export type ReviewResultDto = {
xp_earned: number;
accuracy: number;
cards_reviewed: number;
duration_ms: number;
streak_days: number;
level: string;
};
export type ReviewSessionDto = {
id: number;
cards: Array<any>;
session_size: number;
deck_id: number | null;
};
export type SubmitReviewItemDto = {
card_id: number;
knew: boolean;
time_spent_ms: number;
};
}
declare namespace App.Repositories.Role.DTOs {
export type PermissionDto = {
id: number;
entity: string;
action: string;
description: string | null;
};
export type RoleDto = {
id: number;
name: string;
slug: string;
description: string | null;
is_system: boolean;
permissions: Array<string>;
};
}
declare namespace App.Repositories.Stat.DTOs {
export type UserStatDto = {
total_cards: number;
mastered: number;
in_progress: number;
accuracy: number;
streak_days: number;
total_time_ms: number;
level: string;
xp: number;
xp_to_next_level: number;
};
}
