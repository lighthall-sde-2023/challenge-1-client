import React from 'react';
import { IClickInfo } from './types';

export default function CountItem({ id, clicks }: IClickInfo) {
	return (
		<li className="count-item">
			<h3>{id}</h3>
			<span />
			<h4>{clicks}</h4>
		</li>
	);
}
