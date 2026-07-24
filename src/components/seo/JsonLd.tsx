/**
 * Renders one or more Schema.org JSON-LD objects as a <script> tag.
 * `<` is escaped to `<` to prevent breaking out of the script element.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
	const nodes = Array.isArray(data) ? data : [data];
	return (
		<>
			{nodes.map((node, i) => (
				<script
					key={i}
					type='application/ld+json'
					dangerouslySetInnerHTML={{ __html: JSON.stringify(node).replace(/</g, "\\u003c") }}
				/>
			))}
		</>
	);
}
