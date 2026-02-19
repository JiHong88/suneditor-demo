"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Puzzle, Play, BookOpen, Download, Github, Package, Settings, Wrench, Lightbulb, ArrowRight, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";

const pluginTypes = {
	toolbar: {
		title: "Toolbar Plugins",
		icon: <Settings className='h-5 w-5' />,
		description: "Add custom buttons and controls to the toolbar",
		examples: [
			{
				name: "CustomButton",
				description: "Add a custom button with your own functionality",
				difficulty: "Beginner",
				codePreview: `SUNEDITOR.create('editor', {
  plugins: [MyCustomPlugin],
  buttonList: [
    ['customButton', 'bold', 'italic']
  ]
});`,
			},
			{
				name: "ColorPicker",
				description: "Advanced color picker with palette management",
				difficulty: "Intermediate",
				codePreview: `const colorPickerPlugin = {
  name: 'colorPicker',
  display: 'command',
  add: function(core, targetElement) {
    // Implementation
  }
};`,
			},
		],
	},
	formatting: {
		title: "Formatting Plugins",
		icon: <Code2 className='h-5 w-5' />,
		description: "Create custom text formatting and styling options",
		examples: [
			{
				name: "CustomFormat",
				description: "Apply custom CSS classes to selected text",
				difficulty: "Beginner",
				codePreview: `const customFormatPlugin = {
  name: 'customFormat',
  command: 'customFormat',
  display: 'command',
  add: function(core) {
    const context = core.context;
    context.customFormat = {
      targetButton: targetElement
    };
  }
};`,
			},
			{
				name: "MathFormula",
				description: "Insert and edit mathematical formulas",
				difficulty: "Advanced",
				codePreview: `const mathPlugin = {
  name: 'math',
  display: 'dialog',
  add: function(core, targetElement) {
    // MathJax integration
  }
};`,
			},
		],
	},
	content: {
		title: "Content Plugins",
		icon: <Package className='h-5 w-5' />,
		description: "Insert and manage different types of content",
		examples: [
			{
				name: "EmbedCode",
				description: "Embed external content like tweets, videos",
				difficulty: "Intermediate",
				codePreview: `const embedPlugin = {
  name: 'embed',
  display: 'dialog',
  add: function(core, targetElement) {
    // Dialog for embed URLs
  }
};`,
			},
			{
				name: "FileAttachment",
				description: "Upload and manage file attachments",
				difficulty: "Advanced",
				codePreview: `const filePlugin = {
  name: 'fileAttachment',
  display: 'command',
  add: function(core, targetElement) {
    // File upload handling
  }
};`,
			},
		],
	},
	utility: {
		title: "Utility Plugins",
		icon: <Wrench className='h-5 w-5' />,
		description: "Add helpful utilities and workflow enhancements",
		examples: [
			{
				name: "WordCount",
				description: "Display real-time word and character count",
				difficulty: "Beginner",
				codePreview: `const wordCountPlugin = {
  name: 'wordCount',
  display: 'command',
  add: function(core) {
    // Count words and characters
  }
};`,
			},
			{
				name: "AutoSave",
				description: "Automatically save content to localStorage",
				difficulty: "Intermediate",
				codePreview: `const autoSavePlugin = {
  name: 'autoSave',
  add: function(core) {
    core.addEvent('input', function() {
      // Auto-save logic
    });
  }
};`,
			},
		],
	},
};

const builtin_plugins = [
	{ name: "table", description: "Advanced table creation and editing", category: "content" },
	{ name: "image", description: "Image upload, resize, and alignment", category: "content" },
	{ name: "video", description: "Video embedding and playback", category: "content" },
	{ name: "audio", description: "Audio file embedding", category: "content" },
	{ name: "link", description: "Hyperlink creation and management", category: "formatting" },
	{ name: "list", description: "Ordered and unordered lists", category: "formatting" },
	{ name: "align", description: "Text alignment controls", category: "formatting" },
	{ name: "font", description: "Font family and size selection", category: "formatting" },
	{ name: "fontSize", description: "Font size controls", category: "formatting" },
	{ name: "fontColor", description: "Text color picker", category: "formatting" },
	{ name: "hiliteColor", description: "Text highlight colors", category: "formatting" },
	{ name: "horizontalRule", description: "Insert horizontal dividers", category: "content" },
	{ name: "formatBlock", description: "Block formatting (h1, p, etc)", category: "formatting" },
];

const codeExamples = {
	basic: `// Basic plugin structure
const myPlugin = {
  name: 'myPlugin',
  display: 'command', // 'command', 'dialog', 'submenu'

  add: function(core, targetElement) {
    // Plugin initialization
    const context = core.context;
    context.myPlugin = {
      targetButton: targetElement
    };
  },

  active: function(element) {
    // Return true if plugin should be active
    return false;
  },

  action: function() {
    // Plugin action when clicked
    const core = this.core;
    core.insertHTML('<span>Custom content</span>');
  }
};

// Register the plugin
SUNEDITOR.create('editor', {
  plugins: [myPlugin],
  buttonList: [['myPlugin']]
});`,

	dialog: `// Dialog-based plugin
const dialogPlugin = {
  name: 'customDialog',
  display: 'dialog',

  add: function(core, targetElement) {
    const context = core.context;

    // Create dialog HTML
    const dialog_div = document.createElement('DIV');
    dialog_div.className = 'se-dialog-content';
    dialog_div.innerHTML = \`
      <form class="editor_dialog">
        <div class="se-dialog-header">
          <button type="button" class="se-btn se-dialog-close">×</button>
          <span class="se-modal-title">Custom Dialog</span>
        </div>
        <div class="se-dialog-body">
          <input type="text" placeholder="Enter text..." />
        </div>
        <div class="se-dialog-footer">
          <button type="submit" class="se-btn-primary">Insert</button>
          <button type="button" class="se-btn se-dialog-close">Cancel</button>
        </div>
      </form>
    \`;

    context.customDialog = {
      modal: dialog_div,
      textInput: dialog_div.querySelector('input[type="text"]')
    };
  },

  open: function() {
    this.core.showDialog('customDialog');
  },

  submit: function(e) {
    e.preventDefault();
    const text = this.core.context.customDialog.textInput.value;
    if (text.trim()) {
      this.core.insertHTML('<span class="custom">' + text + '</span>');
    }
    this.core.closeDialog();
  }
};`,

	submenu: `// Submenu plugin
const submenuPlugin = {
  name: 'customSubmenu',
  display: 'submenu',

  add: function(core, targetElement) {
    const context = core.context;

    // Create submenu list
    const listDiv = document.createElement('DIV');
    listDiv.className = 'se-submenu se-list-layer';
    listDiv.innerHTML = \`
      <div class="se-list-inner">
        <ul class="se-list-basic">
          <li><button type="button" data-command="option1">Option 1</button></li>
          <li><button type="button" data-command="option2">Option 2</button></li>
          <li><button type="button" data-command="option3">Option 3</button></li>
        </ul>
      </div>
    \`;

    context.customSubmenu = {
      targetButton: targetElement,
      _menuTray: listDiv
    };
  },

  on: function() {
    this.core.showSubmenu('customSubmenu');
  },

  pickUp: function(e) {
    e.preventDefault();
    e.stopPropagation();

    const command = e.target.getAttribute('data-command');
    switch(command) {
      case 'option1':
        this.core.insertHTML('<span class="option-1">Option 1 Content</span>');
        break;
      case 'option2':
        this.core.insertHTML('<span class="option-2">Option 2 Content</span>');
        break;
      case 'option3':
        this.core.insertHTML('<span class="option-3">Option 3 Content</span>');
        break;
    }

    this.core.closeSubmenu();
  }
};`,
};

export default function PluginGuidePage() {
	const [selectedType, setSelectedType] = useState("toolbar");
	const [selectedExample, setSelectedExample] = useState("basic");
	const t = useTranslations("PluginGuide");

	return (
		<div className='min-h-screen'>
			{/* Header */}
			<section className='container mx-auto px-6 py-12'>
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='text-center max-w-4xl mx-auto'>
					<Badge variant='secondary' className='mb-4'>
						<Puzzle className='mr-2 h-4 w-4' />
						Plugin Development
					</Badge>
					<h1 className='text-4xl font-bold tracking-tight md:text-5xl'>SunEditor Plugin Guide</h1>
					<p className='mt-4 text-lg text-muted-foreground'>Learn how to extend SunEditor with custom plugins. From simple toolbar buttons to complex dialog-based features.</p>
					<div className='flex flex-wrap gap-4 justify-center mt-8'>
						<Button asChild>
							<Link href='/playground'>Try in Playground</Link>
						</Button>
						<Button variant='outline' asChild>
							<Link href='/docs/api'>API Reference</Link>
						</Button>
						<Button variant='ghost' asChild className='gap-2'>
							<Link href='https://github.com/JiHong88/SunEditor' target='_blank'>
								<Github className='h-4 w-4' />
								GitHub
							</Link>
						</Button>
					</div>
				</motion.div>
			</section>

			<div className='container mx-auto px-6 pb-20'>
				{/* Plugin Types */}
				<motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mb-16'>
					<h2 className='text-2xl font-semibold mb-8'>Plugin Types</h2>
					<Tabs value={selectedType} onValueChange={setSelectedType}>
						<TabsList className='grid grid-cols-2 lg:grid-cols-4 mb-8'>
							{Object.entries(pluginTypes).map(([key, type]) => (
								<TabsTrigger key={key} value={key} className='flex items-center gap-2'>
									{type.icon}
									<span className='hidden sm:inline'>{type.title.split(" ")[0]}</span>
								</TabsTrigger>
							))}
						</TabsList>

						{Object.entries(pluginTypes).map(([key, type]) => (
							<TabsContent key={key} value={key}>
								<Card className='mb-8'>
									<CardHeader>
										<CardTitle className='flex items-center gap-2'>
											{type.icon}
											{type.title}
										</CardTitle>
										<CardDescription>{type.description}</CardDescription>
									</CardHeader>
								</Card>

								<div className='grid md:grid-cols-2 gap-6'>
									{type.examples.map((example) => (
										<Card key={example.name} className='h-full'>
											<CardHeader>
												<div className='flex items-center justify-between'>
													<CardTitle className='text-lg'>{example.name}</CardTitle>
													<Badge variant={example.difficulty === "Beginner" ? "secondary" : example.difficulty === "Intermediate" ? "default" : "destructive"}>
														{example.difficulty}
													</Badge>
												</div>
												<CardDescription>{example.description}</CardDescription>
											</CardHeader>
											<CardContent>
												<pre className='text-xs bg-muted p-3 rounded-lg overflow-x-auto mb-4'>
													<code>{example.codePreview}</code>
												</pre>
												<Button variant='outline' size='sm' className='w-full'>
													<Play className='mr-2 h-4 w-4' />
													View Full Example
												</Button>
											</CardContent>
										</Card>
									))}
								</div>
							</TabsContent>
						))}
					</Tabs>
				</motion.section>

				{/* Built-in Plugins */}
				<motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className='mb-16'>
					<div className='flex items-center justify-between mb-8'>
						<h2 className='text-2xl font-semibold'>Built-in Plugins</h2>
						<Button variant='outline' asChild>
							<Link href='/docs/plugins'>
								View All Documentation
								<ExternalLink className='ml-2 h-4 w-4' />
							</Link>
						</Button>
					</div>
					<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{builtin_plugins.map((plugin) => (
							<Card key={plugin.name} className='h-full'>
								<CardContent className='p-4'>
									<div className='flex items-center justify-between mb-2'>
										<code className='text-sm font-medium bg-muted px-2 py-1 rounded'>{plugin.name}</code>
										<Badge variant='outline' className='text-xs'>
											{plugin.category}
										</Badge>
									</div>
									<p className='text-sm text-muted-foreground'>{plugin.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</motion.section>

				{/* Code Examples */}
				<motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className='mb-16'>
					<h2 className='text-2xl font-semibold mb-8'>Code Examples</h2>
					<Card>
						<CardHeader>
							<CardTitle>Plugin Implementation Patterns</CardTitle>
							<CardDescription>Common patterns and structures for different types of plugins</CardDescription>
						</CardHeader>
						<CardContent>
							<Tabs value={selectedExample} onValueChange={setSelectedExample}>
								<TabsList className='mb-4'>
									<TabsTrigger value='basic'>Basic Plugin</TabsTrigger>
									<TabsTrigger value='dialog'>Dialog Plugin</TabsTrigger>
									<TabsTrigger value='submenu'>Submenu Plugin</TabsTrigger>
								</TabsList>

								{Object.entries(codeExamples).map(([key, code]) => (
									<TabsContent key={key} value={key}>
										<pre className='text-sm bg-muted p-4 rounded-lg overflow-x-auto'>
											<code>{code}</code>
										</pre>
										<div className='flex gap-2 mt-4'>
											<Button variant='outline' size='sm'>
												<Download className='mr-2 h-4 w-4' />
												Download Template
											</Button>
											<Button variant='outline' size='sm'>
												<Play className='mr-2 h-4 w-4' />
												Try in Playground
											</Button>
										</div>
									</TabsContent>
								))}
							</Tabs>
						</CardContent>
					</Card>
				</motion.section>

				{/* Best Practices */}
				<motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className='mb-16'>
					<h2 className='text-2xl font-semibold mb-8'>Best Practices</h2>
					<div className='grid md:grid-cols-2 gap-6'>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Lightbulb className='h-5 w-5 text-yellow-500' />
									Development Tips
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div>
									<h4 className='font-medium mb-2'>Keep it Simple</h4>
									<p className='text-sm text-muted-foreground'>Start with basic functionality and add complexity gradually</p>
								</div>
								<Separator />
								<div>
									<h4 className='font-medium mb-2'>Error Handling</h4>
									<p className='text-sm text-muted-foreground'>Always include proper error handling for user inputs</p>
								</div>
								<Separator />
								<div>
									<h4 className='font-medium mb-2'>Performance</h4>
									<p className='text-sm text-muted-foreground'>Minimize DOM manipulation and use event delegation</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<BookOpen className='h-5 w-5 text-blue-500' />
									Resources
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<Button variant='outline' className='w-full justify-start' asChild>
									<Link href='/docs/api'>
										API Documentation
										<ArrowRight className='ml-auto h-4 w-4' />
									</Link>
								</Button>
								<Button variant='outline' className='w-full justify-start' asChild>
									<Link href='/examples'>
										Plugin Examples
										<ArrowRight className='ml-auto h-4 w-4' />
									</Link>
								</Button>
								<Button variant='outline' className='w-full justify-start' asChild>
									<Link href='https://github.com/JiHong88/SunEditor/tree/master/src/plugins' target='_blank'>
										Source Code
										<ExternalLink className='ml-auto h-4 w-4' />
									</Link>
								</Button>
								<Button variant='outline' className='w-full justify-start' asChild>
									<Link href='https://github.com/JiHong88/SunEditor/discussions' target='_blank'>
										Community Support
										<ExternalLink className='ml-auto h-4 w-4' />
									</Link>
								</Button>
							</CardContent>
						</Card>
					</div>
				</motion.section>

				{/* Call to Action */}
				<motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
					<Card className='bg-gradient-to-r from-primary/5 to-secondary/5'>
						<CardContent className='p-8 text-center'>
							<Puzzle className='h-12 w-12 mx-auto mb-4 text-primary' />
							<h3 className='text-2xl font-semibold mb-4'>Ready to Build Your Plugin?</h3>
							<p className='text-muted-foreground mb-6 max-w-2xl mx-auto'>
								Start creating your custom plugin today. Use our playground to test your ideas and refer to the documentation for detailed implementation guides.
							</p>
							<div className='flex flex-wrap gap-4 justify-center'>
								<Button asChild className='group'>
									<Link href='/playground'>
										Start in Playground
										<ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
									</Link>
								</Button>
								<Button variant='outline' asChild>
									<Link href='/docs/plugin-api'>Plugin API Docs</Link>
								</Button>
								<Button variant='ghost' asChild>
									<Link href='https://github.com/JiHong88/SunEditor/tree/master/src/plugins' target='_blank'>
										<Github className='mr-2 h-4 w-4' />
										View Source
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</motion.section>
			</div>
		</div>
	);
}
