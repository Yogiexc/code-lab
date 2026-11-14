module main

import os

struct AchievementGuide {
	id          string
	title       string
	speed_time  string
	difficulty  string
	instruction string
}

fn get_guides() []AchievementGuide {
	return [
		AchievementGuide{
			id: 'quickdraw'
			title: 'Quickdraw'
			speed_time: '< 5 Minutes'
			difficulty: 'Solo / Instant'
			instruction: 'Open an issue or pull request, then close it within 5 minutes.'
		},
		AchievementGuide{
			id: 'pull-shark'
			title: 'Pull Shark'
			speed_time: '2 - 5 Minutes'
			difficulty: 'Cumulative'
			instruction: 'Merge PRs into the default branch (Bronze: 2, Silver: 16, Gold: 128).'
		},
		AchievementGuide{
			id: 'galaxy-brain'
			title: 'Galaxy Brain'
			speed_time: '5 Minutes'
			difficulty: 'Collaborative'
			instruction: 'Provide answers in Q&A Discussions and receive accepted answer marks (2x).'
		},
		AchievementGuide{
			id: 'pair-extraordinaire'
			title: 'Pair Extraordinaire'
			speed_time: '3 Minutes'
			difficulty: 'Co-Author'
			instruction: 'Merge a pull request containing RFC-compliant Co-authored-by: trailers.'
		},
		AchievementGuide{
			id: 'yolo'
			title: 'YOLO'
			speed_time: '1 Minute'
			difficulty: 'Autonomous'
			instruction: 'Merge a pull request directly without waiting for reviewer approval.'
		},
		AchievementGuide{
			id: 'public-sponsor'
			title: 'Public Sponsor'
			speed_time: 'Instant'
			difficulty: 'Sponsorship'
			instruction: 'Sponsor an open-source contributor with public visibility via GitHub Sponsors.'
		},
		AchievementGuide{
			id: 'starstruck'
			title: 'Starstruck'
			speed_time: 'Cumulative'
			difficulty: 'Community'
			instruction: 'Maintain a repository reaching threshold stars (Tier 1: 16 stars).'
		},
	]
}

fn main() {
	println('=====================================================')
	println('GitBadge CLI Tool - Powered by V (Vlang) Engine')
	println('=====================================================')
	guides := get_guides()

	if os.args.len > 1 {
		query := os.args[1]
		for g in guides {
			if g.id == query {
				println('Badge      : ${g.title}')
				println('Time Est   : ${g.speed_time}')
				println('Difficulty : ${g.difficulty}')
				println('Instruction: ${g.instruction}')
				return
			}
		}
		println('Badge not found: ${query}')
		return
	}

	for g in guides {
		println('[${g.id}] ${g.title} (${g.speed_time}) - ${g.difficulty}')
	}
}
