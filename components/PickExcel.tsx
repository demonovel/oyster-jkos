import React from 'react';
import { PropsWithChildren, ReactNode } from 'react';
import _styles from './PickExcel.module.scss';
import { useFilePicker } from "use-file-picker";
import {
	readFile,
	utils,
	read,
	WorkBook,
	ParsingOptions,
} from 'xlsx';
import PrintJkosExcel from './PrintJkosExcel';

export default function PickExcel({
	children,
	...prop
}: PropsWithChildren<{}>)
{
	const [
		openFileSelector,
		{ filesContent, loading, errors, plainFiles },
	] = useFilePicker({
		multiple: true,
		readAs: "ArrayBuffer", // availible formats: "Text" | "BinaryString" | "ArrayBuffer" | "DataURL"
		// accept: '.ics,.pdf',
		//accept: [".json", ".pdf"],
		//limitFilesConfig: { min: 1, max: 1 }
		// minFileSize: 1, // in megabytes
		// maxFileSize: 1,
		// maxImageHeight: 1024, // in pixels
		// minImageHeight: 1024,
		// maxImageWidth: 768,
		// minImageWidth: 768
		// readFilesContent: false, // ignores file content
	});

	if (errors.length)
	{
		return (
			<div>
				<button onClick={() => openFileSelector()}>
					Something went wrong, retry!{" "}
				</button>
				{errors[0].fileSizeTooSmall && "File size is too small!"}
				{errors[0].fileSizeToolarge && "File size is too large!"}
				{errors[0].readerError && "Problem occured while reading file!"}
				{errors[0].maxLimitExceeded && "Too many files"}
				{errors[0].minLimitNotReached && "Not enought files"}
			</div>
		);
	}

	if (loading)
	{
		return <div>Loading...</div>;
	}

	return (
		<div>
			<button onClick={() => openFileSelector()}>Select file</button>
			<br />
			Number of selected files:
			{plainFiles.length}
			<br />
			{/* If readAs is set to DataURL, You can display an image */}
			<br />
			{filesContent.map((data, i) =>
			{
				return (
					<PrintJkosExcel data={data}/>
				)
			})}
		</div>
	);
}
