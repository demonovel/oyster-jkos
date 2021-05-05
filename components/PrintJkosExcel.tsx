import React from 'react';
import { PropsWithChildren, ReactNode } from 'react';
import _styles from './PrintJkosExcel.module.scss';
import { FileContent } from 'use-file-picker/src/interfaces';
import {
	readFile,
	utils,
	read,
	WorkBook,
	ParsingOptions,
} from 'xlsx';
import Big from 'big.js';

export default function PrintJkosExcel({
	children,
	data,
	...prop
}: PropsWithChildren<{
	data: FileContent
}>)
{
	const wb = read(data.content, {
		type: 'array',
		sheets: '支付請款明細',
		cellNF: true,
		cellFormula: true,
	});

	const ws = wb.Sheets['支付請款明細'];

	if (ws?.['A2']?.v !== '編號')
	{
		return (<div>
			檔案不正確
		</div>)
	}

	console.dir(ws['!ref'])

	let dr = utils.decode_range(ws['!ref']!);

//	console.dir(dr)

	dr.s.r = 1;

	if (ws['A' + (dr.e.r + 1)].v === '總計')
	{
		dr.e.r = dr.e.r - 1;
	}

	ws['!ref'] = utils.encode_range(dr);

	let json = utils.sheet_to_json(ws, {
		blankrows: false,
		raw: false,
	})

	let ret = json.reduce((a: Record<string, {
		list: any[],
		num: number,
		total: number,
		total_order: number,
	}>, b: any) =>
	{

		let name = String(b['店舖名稱']).trim();

		a[name] ??= {} as any;

		a[name]['list'] ??= [];
		a[name]['list'].push(b);

		a[name]['num'] = (a[name]['num'] ??= 0) + 1;

		let n = b['請款金額小計'].replace(/,/, '');

		a[name]['total'] = Big(a[name]['total'] ?? 0).add(n).toNumber();

		n = b['訂單金額'].replace(/,/, '');

		a[name]['total_order'] = Big(a[name]['total_order'] ?? 0).add(n).toNumber();

		if (isNaN(a[name]['total']))
		{
			console.dir({
				name,
				n,
				b,
			});
			throw new Error
		}

		return a
	}, {});

	return <>
		<table>
			{Object.entries(ret)
				.map(([n, b]) =>
				{
					return (<tr>
						<td>{n}</td>
						<td>交易金額 ${b.total_order}</td>
						<td>請款金額 ${b.total}</td>
						<td>共 ${b.num} 筆交易</td>
					</tr>)
				})}
		</table>
	</>
}
