import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import markdownStyles from './markdown-styles.module.css';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';

import Image from 'next/image';

const renderOptions = {
	renderNode: {
		[BLOCKS.HEADING_1]: (node, children) => {
			return <h2 className='underline italic'>{children}</h2>;
		},
		[BLOCKS.EMBEDDED_ASSET]: (node, children) => {
			return <img src='' />;
		},
	},
};

export default function PostBody({ content }) {
	return (
		<div className='max-w-2xl mx-auto'>
			<div className={markdownStyles['markdown']}>
				{documentToReactComponents(
					content.json,
					getRenderOptions(content.links)
				)}
			</div>
		</div>
	);
}

const getRenderOptions = (links) => {
	// iterate over incoming links and put them in a map
	const blockAssets = new Map(
		links.assets.block.map((asset) => [asset.sys.id, asset])
	);

	return {
		renderNode: {
			[BLOCKS.HEADING_1]: (node, children) => {
				return <h2 className='underline italic'>{children}</h2>;
			},
			[BLOCKS.EMBEDDED_ASSET]: (node, children) => {
				console.log(node);
				// use the asset map to access and render a proper image element
				const asset = blockAssets.get(node.data.target.sys.id);
				const { url, width, height, description } = asset;
				return (
					<Image
						layout='responsive'
						sizes='(max-width:600px) 98vw, 500px'
						className='border'
						src={url}
						width={width}
						height={height}
						alt={description}
					/>
				);
			},
		},
	};
};
