'use client';

import Image from 'next/image';

export default function NotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center gap-12 px-6">
				<Image
					alt="404 not found"
					height={400}
					quality={95}
					src="/static/404.png"
					width={400}
				/>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-3">
					<p className="text-xl text-gray-300">Кажется, запрашиваемая страница не найдена</p>
					<p className="text-sm text-gray-500">Проверьте введенный URL или вернитесь на главную</p>
				</div>
			</div>
		</div>
	);
}