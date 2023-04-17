import { useCallback, useEffect, useRef, useState } from 'react';
import { IClickInfo, ServerResponse } from '../types';
import axios from 'axios';
export const clicksApi = axios.create({
	baseURL: 'https://lighthall-sde-1-server.oyintareebelo.repl.co/',
});
export const BACKEND_UPDATE_TIMEOUT = 700;

export function useClicksApi(): [
	boolean,
	() => void,
	{ [key: string]: IClickInfo }
] {
	const queuedUpdates = useRef<{
		[key: string]: {
			delta: number;
			timeout: ReturnType<typeof setTimeout>;
		};
	}>({}).current;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [location, _] = useState(
		(
			Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1] ||
			'Unknown'
		).replaceAll('_', ' ')
	);
	const [clicksData, setClicksData] = useState<{ [key: string]: IClickInfo }>(
		{}
	);

	const [loaded, setHasLoaded] = useState(false);

	const updateClicksOnServer = useCallback(
		(id: string) => {
			if (queuedUpdates[id]) {
				clearTimeout(queuedUpdates[id].timeout);
				queuedUpdates[id].delta = queuedUpdates[id].delta + 1;
				queuedUpdates[id].timeout = setTimeout(() => {
					clicksApi
						.post(`/clicks/${location}/${queuedUpdates[id].delta}`)
						.catch(console.log);
					delete queuedUpdates[id];
				}, BACKEND_UPDATE_TIMEOUT);
			} else {
				queuedUpdates[id] = {
					delta: 1,
					timeout: setTimeout(() => {
						clicksApi
							.post(`/clicks/${location}/${queuedUpdates[id].delta}`)
							.catch(console.log);
					}, BACKEND_UPDATE_TIMEOUT),
				};
			}
		},
		[location, queuedUpdates]
	);

	const updateClicks = useCallback(() => {
		setClicksData((s) => {
			return {
				...s,
				[location]: {
					id: location,
					clicks: (s[location]?.clicks || 0) + 1,
				},
			};
		});

		updateClicksOnServer(location);
	}, [location, updateClicksOnServer]);

	useEffect(() => {
		clicksApi.get<ServerResponse<IClickInfo[]>>('clicks').then((response) => {
			if (response.data.error) {
				alert(response.data.error);
				return;
			}

			setClicksData(
				response.data.data.reduce((indexed, toIndex) => {
					indexed[toIndex.id] = toIndex;
					return indexed;
				}, {} as typeof clicksData)
			);
			setHasLoaded(true);
		});
	}, []);

	return [loaded, updateClicks, clicksData];
}
