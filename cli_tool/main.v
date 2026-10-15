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
			title: 'Quickdraw 🤠'
			speed_time: '< 5 Menit'
			difficulty: 'Mudah (100% Solo)'
			instruction: 'Bikin issue baru di repo publik, lalu langsung klik Close issue.'
		},
		AchievementGuide{
			id: 'pull-shark'
			title: 'Pull Shark 🦈'
			speed_time: '2 - 5 Menit'
			difficulty: 'Mudah'
			instruction: 'Merge PR ke main (Bronze: 2 PR, Silver: 16 PR, Gold: 128 PR).'
		},
		AchievementGuide{
			id: 'galaxy-brain'
			title: 'Galaxy Brain 🧠'
			speed_time: '5 Menit'
			difficulty: 'Kolaborasi'
			instruction: 'Jawab pertanyaan Q&A di Discussions dan di-mark as answer (2x).'
		},
		AchievementGuide{
			id: 'pair-extraordinaire'
			title: 'Pair Extraordinaire 🤝'
			speed_time: '3 Menit'
			difficulty: 'Co-Author'
			instruction: 'Merge PR yang mengandung trailer Co-authored-by:.'
		},
	]
}

fn main() {
	println('=====================================================')
	println('⚡ GitBadge CLI Tool - Powered by V (Vlang) Engine')
	println('=====================================================')
	guides := get_guides()
	for g in guides {
		println('[${g.id.to_upper()}] ${g.title}')
		println('   ⏱️  Waktu      : ${g.speed_time}')
		println('   🎯 Kesulitan  : ${g.difficulty}')
		println('   📝 Cara Cepat : ${g.instruction}')
		println('-----------------------------------------------------')
	}
	println('🚀 Kunjungi Web App: https://code-lab-five-cyan.vercel.app/')
}
