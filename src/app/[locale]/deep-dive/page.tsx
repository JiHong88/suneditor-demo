"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Cpu, Zap, Network, Eye, Code2, Database, ArrowDown, ArrowRight, Activity, Layers, GitBranch } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";

const architectureTopics = {
	core: {
		title: "Core Architecture",
		icon: <Cpu className='h-5 w-5' />,
		description: "Understanding SunEditor's core structure and design patterns",
		sections: [
			{
				title: "Core Module",
				content: "The heart of SunEditor that manages editor state, DOM manipulation, and plugin coordination.",
				code: `const core = {
  context: {}, // Editor context and references
  options: {}, // Configuration options
  plugins: {}, // Loaded plugins
  commandMap: {}, // Available commands

  // Core methods
  create: function(element, options) {
    // Initialize editor
  },

  focus: function() {
    // Focus management
  },

  insertHTML: function(html) {
    // Content insertion
  }
};`,
			},
			{
				title: "Plugin System",
				content: "Modular plugin architecture allowing extensible functionality without core modifications.",
				code: `// Plugin registration
SUNEDITOR.create('editor', {
  plugins: [
    plugin1, plugin2, customPlugin
  ],

  // Plugin lifecycle hooks
  onCreate: function(core) {
    // After editor creation
  },

  onResized: function(core) {
    // After editor resize
  }
});`,
			},
			{
				title: "Command System",
				content: "Unified command interface for all editor operations, enabling undo/redo and programmatic control.",
				code: `// Command execution
core.execCommand('bold');
core.execCommand('fontSize', '16px');

// Custom commands
core.addCommand('myCommand', function(value) {
  // Command implementation
});`,
			},
		],
	},
	lifecycle: {
		title: "Event Lifecycle",
		icon: <Activity className='h-5 w-5' />,
		description: "How SunEditor processes events and manages state changes",
		sections: [
			{
				title: "Initialization Flow",
				content: "Step-by-step process of editor creation and setup.",
				code: `1. Parse options and validate
2. Create DOM structure
3. Load and initialize plugins
4. Set up event listeners
5. Apply initial content
6. Trigger onCreate callback`,
			},
			{
				title: "Event Processing",
				content: "How user interactions are captured and processed through the event system.",
				code: `// Event flow
User Input → Event Capture → Plugin Handlers →
Core Processing → DOM Update → State Update →
Event Callbacks → UI Update`,
			},
			{
				title: "State Management",
				content: "Editor state synchronization and history management.",
				code: `const editorState = {
  contents: '', // Current HTML content
  history: [], // Undo/redo stack
  selection: {}, // Current selection

  // State methods
  save: function() {
    // Save current state
  },

  restore: function(state) {
    // Restore previous state
  }
};`,
			},
		],
	},
	rendering: {
		title: "Rendering Engine",
		icon: <Eye className='h-5 w-5' />,
		description: "How SunEditor renders content and manages the editing interface",
		sections: [
			{
				title: "Virtual Editing Area",
				content: "SunEditor uses a contentEditable div with careful DOM management for optimal editing experience.",
				code: `<div class="se-wrapper">
  <div class="se-toolbar">
    <!-- Toolbar buttons -->
  </div>
  <div class="se-wrapper-inner">
    <div class="se-wrapper-wysiwyg">
      <div contenteditable="true" class="se-element">
        <!-- Editable content -->
      </div>
    </div>
  </div>
</div>`,
			},
			{
				title: "Content Sanitization",
				content: "Built-in content cleaning and security measures to prevent XSS and maintain consistency.",
				code: `const sanitizer = {
  clean: function(html) {
    // Remove dangerous elements
    // Normalize formatting
    // Apply consistent styling
    return cleanHtml;
  },

  allowedTags: ['p', 'div', 'span', 'strong', 'em'],
  allowedAttributes: ['class', 'style', 'href']
};`,
			},
			{
				title: "Performance Optimization",
				content: "Techniques used to maintain smooth editing performance even with large documents.",
				code: `// Performance strategies
1. Lazy loading of plugins
2. Efficient DOM queries
3. Event delegation
4. Debounced operations
5. Virtual scrolling for large content
6. Minimal reflow/repaint`,
			},
		],
	},
	apis: {
		title: "Internal APIs",
		icon: <Network className='h-5 w-5' />,
		description: "Deep dive into SunEditor's internal API structure and extension points",
		sections: [
			{
				title: "Core APIs",
				content: "Primary interfaces for interacting with the editor programmatically.",
				code: `// Content manipulation
core.getContents(); // Get HTML content
core.setContents(html); // Set HTML content
core.insertHTML(html); // Insert at cursor

// Selection management
core.getSelection(); // Get current selection
core.setSelection(start, end); // Set selection range
core.selectAll(); // Select all content

// Editor control
core.focus(); // Focus editor
core.blur(); // Remove focus
core.disable(); // Disable editing
core.enable(); // Enable editing`,
			},
			{
				title: "Plugin APIs",
				content: "APIs available to plugins for extending editor functionality.",
				code: `// Plugin context
const context = core.context;

// Dialog management
core.showDialog('pluginName');
core.closeDialog();

// Submenu management
core.showSubmenu('pluginName');
core.closeSubmenu();

// Command registration
core.addCommand('commandName', function(value) {
  // Command implementation
});

// Event handling
core.addEvent('input', function(e) {
  // Handle input events
});`,
			},
			{
				title: "Utility APIs",
				content: "Helper functions and utilities for common operations.",
				code: `// DOM utilities
core.util.getParentElement(element, tagName);
core.util.isFormatElement(element);
core.util.createElement(tagName, className);

// Range utilities
core.util.getSelection();
core.util.createRange();
core.util.insertNode(node);

// Content utilities
core.util.htmlRemoveWhiteSpace(html);
core.util.getTextContent(element);
core.util.isEmptyNode(node);`,
			},
		],
	},
	performance: {
		title: "Performance & Memory",
		icon: <Zap className='h-5 w-5' />,
		description: "Understanding performance characteristics and optimization strategies",
		sections: [
			{
				title: "Memory Management",
				content: "How SunEditor manages memory usage and prevents memory leaks.",
				code: `// Memory optimization strategies
1. Event listener cleanup on destroy
2. DOM reference cleanup
3. Plugin instance management
4. History size limitations
5. Garbage collection friendly patterns

// Example cleanup
destroy: function() {
  // Remove event listeners
  this.removeEventListener();

  // Clear references
  this.context = null;
  this.plugins = null;

  // Remove DOM elements
  this.element.remove();
}`,
			},
			{
				title: "Rendering Performance",
				content: "Techniques for maintaining smooth editing experience during complex operations.",
				code: `// Performance patterns
1. Batch DOM operations
2. Use document fragments
3. Minimize layout thrashing
4. Debounce expensive operations
5. RequestAnimationFrame for updates

// Example batching
const fragment = document.createDocumentFragment();
elements.forEach(el => fragment.appendChild(el));
container.appendChild(fragment);`,
			},
			{
				title: "Bundle Size Optimization",
				content: "How SunEditor keeps the core bundle size minimal through plugin architecture.",
				code: `// Modular loading strategy
Core Bundle: ~45KB gzipped
├── Essential editing functions
├── Basic DOM manipulation
├── Event system
└── Plugin loader

Plugins (load on demand):
├── Table plugin: ~15KB
├── Image plugin: ~12KB
├── Video plugin: ~8KB
└── Custom plugins: Variable`,
			},
		],
	},
};

const codeFlow = [
	{
		step: 1,
		title: "User Interaction",
		description: "User clicks button or types in editor",
		code: "click event → keydown event",
	},
	{
		step: 2,
		title: "Event Capture",
		description: "Event listener captures the interaction",
		code: "addEventListener('click', handler)",
	},
	{
		step: 3,
		title: "Command Execution",
		description: "Appropriate command is executed",
		code: "core.execCommand('bold')",
	},
	{
		step: 4,
		title: "DOM Manipulation",
		description: "Content is modified in the DOM",
		code: "document.execCommand() or custom logic",
	},
	{
		step: 5,
		title: "State Update",
		description: "Editor state is synchronized",
		code: "updateHistory(); updateUI();",
	},
];

export default function DeepDivePage() {
	const [selectedTopic, setSelectedTopic] = useState("core");
	const [selectedSection, setSelectedSection] = useState(0);
	const t = useTranslations("DeepDive");

	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-muted/20'>
			{/* Header */}
			<section className='container mx-auto px-6 py-12'>
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='text-center max-w-4xl mx-auto'>
					<Badge variant='secondary' className='mb-4'>
						<BookOpen className='mr-2 h-4 w-4' />
						Technical Deep Dive
					</Badge>
					<h1 className='text-4xl font-bold tracking-tight md:text-5xl'>SunEditor Architecture</h1>
					<p className='mt-4 text-lg text-muted-foreground'>Explore the internal architecture, design patterns, and technical implementation details of SunEditor v3.</p>
				</motion.div>
			</section>

			<div className='container mx-auto px-6 pb-20'>
				{/* Architecture Overview */}
				<motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mb-16'>
					<h2 className='text-2xl font-semibold mb-8'>Architecture Overview</h2>
					<div className='grid md:grid-cols-3 gap-6'>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Layers className='h-5 w-5 text-blue-500' />
									Layered Design
								</CardTitle>
							</CardHeader>
							<CardContent className='text-sm space-y-2'>
								<div className='p-2 bg-muted rounded'>Plugins Layer</div>
								<ArrowDown className='h-4 w-4 mx-auto text-muted-foreground' />
								<div className='p-2 bg-muted rounded'>Commands Layer</div>
								<ArrowDown className='h-4 w-4 mx-auto text-muted-foreground' />
								<div className='p-2 bg-primary/10 rounded'>Core Engine</div>
								<ArrowDown className='h-4 w-4 mx-auto text-muted-foreground' />
								<div className='p-2 bg-muted rounded'>DOM Interface</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<GitBranch className='h-5 w-5 text-green-500' />
									Event Flow
								</CardTitle>
							</CardHeader>
							<CardContent className='text-sm space-y-2'>
								<div className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-green-500 rounded-full'></div>
									User Input
								</div>
								<div className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
									Event Capture
								</div>
								<div className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
									Command Processing
								</div>
								<div className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-purple-500 rounded-full'></div>
									DOM Update
								</div>
								<div className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-red-500 rounded-full'></div>
									UI Sync
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Database className='h-5 w-5 text-purple-500' />
									Data Flow
								</CardTitle>
							</CardHeader>
							<CardContent className='text-sm'>
								<div className='space-y-3'>
									<div>
										<div className='font-medium'>State Management</div>
										<div className='text-muted-foreground'>Central state with history tracking</div>
									</div>
									<div>
										<div className='font-medium'>Plugin Communication</div>
										<div className='text-muted-foreground'>Event-based plugin coordination</div>
									</div>
									<div>
										<div className='font-medium'>Content Sync</div>
										<div className='text-muted-foreground'>Real-time DOM-state synchronization</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</motion.section>

				{/* Detailed Topics */}
				<motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className='mb-16'>
					<h2 className='text-2xl font-semibold mb-8'>Technical Details</h2>
					<Tabs value={selectedTopic} onValueChange={setSelectedTopic}>
						<TabsList className='grid grid-cols-2 lg:grid-cols-5 mb-8'>
							{Object.entries(architectureTopics).map(([key, topic]) => (
								<TabsTrigger key={key} value={key} className='flex items-center gap-2 text-xs'>
									{topic.icon}
									<span className='hidden sm:inline'>{topic.title.split(" ")[0]}</span>
								</TabsTrigger>
							))}
						</TabsList>

						{Object.entries(architectureTopics).map(([key, topic]) => (
							<TabsContent key={key} value={key}>
								<Card className='mb-6'>
									<CardHeader>
										<CardTitle className='flex items-center gap-2'>
											{topic.icon}
											{topic.title}
										</CardTitle>
										<CardDescription>{topic.description}</CardDescription>
									</CardHeader>
								</Card>

								<div className='grid lg:grid-cols-[300px_1fr] gap-6'>
									{/* Section Navigation */}
									<div className='space-y-2'>
										{topic.sections.map((section, index) => (
											<Button
												key={index}
												variant={selectedSection === index ? "default" : "outline"}
												className='w-full justify-start text-left'
												onClick={() => setSelectedSection(index)}
											>
												{section.title}
											</Button>
										))}
									</div>

									{/* Section Content */}
									<Card>
										<CardHeader>
											<CardTitle className='text-lg'>{topic.sections[selectedSection]?.title}</CardTitle>
											<CardDescription>{topic.sections[selectedSection]?.content}</CardDescription>
										</CardHeader>
										<CardContent>
											<pre className='text-sm bg-muted p-4 rounded-lg overflow-x-auto'>
												<code>{topic.sections[selectedSection]?.code}</code>
											</pre>
										</CardContent>
									</Card>
								</div>
							</TabsContent>
						))}
					</Tabs>
				</motion.section>

				{/* Code Flow Visualization */}
				<motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className='mb-16'>
					<h2 className='text-2xl font-semibold mb-8'>Execution Flow</h2>
					<Card>
						<CardHeader>
							<CardTitle>From User Input to DOM Update</CardTitle>
							<CardDescription>Step-by-step breakdown of how SunEditor processes user interactions</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-6'>
								{codeFlow.map((step, index) => (
									<div key={step.step} className='flex items-start gap-4'>
										<div className='flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium'>{step.step}</div>
										<div className='flex-grow'>
											<div className='flex items-center gap-2 mb-2'>
												<h4 className='font-medium'>{step.title}</h4>
												{index < codeFlow.length - 1 && <ArrowRight className='h-4 w-4 text-muted-foreground' />}
											</div>
											<p className='text-sm text-muted-foreground mb-2'>{step.description}</p>
											<code className='text-xs bg-muted px-2 py-1 rounded'>{step.code}</code>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</motion.section>

				{/* Performance Insights */}
				<motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className='mb-16'>
					<h2 className='text-2xl font-semibold mb-8'>Performance Insights</h2>
					<div className='grid md:grid-cols-2 gap-6'>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Zap className='h-5 w-5 text-yellow-500' />
									Optimization Strategies
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div>
									<h4 className='font-medium mb-2'>Lazy Plugin Loading</h4>
									<p className='text-sm text-muted-foreground'>Plugins are loaded only when first used, reducing initial bundle size</p>
								</div>
								<Separator />
								<div>
									<h4 className='font-medium mb-2'>Event Delegation</h4>
									<p className='text-sm text-muted-foreground'>Single event listener handles multiple elements, reducing memory usage</p>
								</div>
								<Separator />
								<div>
									<h4 className='font-medium mb-2'>Virtual Scrolling</h4>
									<p className='text-sm text-muted-foreground'>Large documents render only visible portions for better performance</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Activity className='h-5 w-5 text-green-500' />
									Memory Management
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div>
									<h4 className='font-medium mb-2'>Automatic Cleanup</h4>
									<p className='text-sm text-muted-foreground'>Event listeners and references are cleaned up on destroy</p>
								</div>
								<Separator />
								<div>
									<h4 className='font-medium mb-2'>History Limits</h4>
									<p className='text-sm text-muted-foreground'>Undo/redo history has configurable size limits to prevent memory bloat</p>
								</div>
								<Separator />
								<div>
									<h4 className='font-medium mb-2'>WeakMap Usage</h4>
									<p className='text-sm text-muted-foreground'>WeakMaps used for DOM element associations to prevent memory leaks</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</motion.section>

				{/* Call to Action */}
				<motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
					<Card className='bg-gradient-to-r from-primary/5 to-secondary/5'>
						<CardContent className='p-8 text-center'>
							<Code2 className='h-12 w-12 mx-auto mb-4 text-primary' />
							<h3 className='text-2xl font-semibold mb-4'>Dive Deeper</h3>
							<p className='text-muted-foreground mb-6 max-w-2xl mx-auto'>
								Ready to explore the source code or contribute to SunEditor? Check out the GitHub repository and join the community.
							</p>
							<div className='flex flex-wrap gap-4 justify-center'>
								<Button asChild>
									<Link href='https://github.com/JiHong88/SunEditor' target='_blank'>
										View Source Code
									</Link>
								</Button>
								<Button variant='outline' asChild>
									<Link href='/plugin-guide'>Plugin Development</Link>
								</Button>
								<Button variant='ghost' asChild>
									<Link href='/docs'>API Documentation</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</motion.section>
			</div>
		</div>
	);
}
