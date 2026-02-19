"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Settings, Download, Copy, Code2, Eye, RotateCcw, Share2, Palette, Type, Table, ImageIcon, Link } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const presetConfigs = {
  basic: {
    name: "Basic",
    description: "Essential formatting tools",
    buttonList: [
      ['undo', 'redo'],
      ['bold', 'italic', 'underline'],
      ['fontColor', 'hiliteColor'],
      ['align', 'list'],
      ['link', 'image']
    ]
  },
  standard: {
    name: "Standard",
    description: "Most commonly used features",
    buttonList: [
      ['undo', 'redo'],
      ['font', 'fontSize', 'formatBlock'],
      ['bold', 'italic', 'underline', 'strike', 'subscript', 'superscript'],
      ['fontColor', 'hiliteColor'],
      ['outdent', 'indent', 'align', 'horizontalRule', 'list', 'lineHeight'],
      ['table', 'link', 'image', 'video']
    ]
  },
  full: {
    name: "Full Features",
    description: "All available tools",
    buttonList: [
      ['undo', 'redo'],
      ['font', 'fontSize', 'formatBlock'],
      ['paragraphStyle', 'blockquote'],
      ['bold', 'italic', 'underline', 'strike', 'subscript', 'superscript'],
      ['fontColor', 'hiliteColor', 'textStyle'],
      ['removeFormat'],
      ['outdent', 'indent', 'align', 'horizontalRule', 'list', 'lineHeight'],
      ['table', 'link', 'image', 'video', 'audio'],
      ['imageGallery'],
      ['fullScreen', 'showBlocks', 'codeView'],
      ['preview', 'print']
    ]
  }
};

const templates = [
  {
    name: "Blog Post",
    content: `<h1>Welcome to My Blog</h1>
<p>This is a sample blog post created with SunEditor. You can <strong>format text</strong>, add <em>emphasis</em>, and create <u>links</u>.</p>

<h2>Features I Love</h2>
<ul>
<li>Easy to use interface</li>
<li>Rich formatting options</li>
<li>Plugin architecture</li>
</ul>

<p>What do you think? <a href="#comments">Leave a comment below!</a></p>`
  },
  {
    name: "Product Description",
    content: `<h2>Premium Wireless Headphones</h2>
<p><strong>Experience superior sound quality</strong> with our latest wireless headphones featuring:</p>

<table style="width: 100%; border-collapse: collapse;">
<thead>
<tr style="background-color: #f5f5f5;">
<th style="border: 1px solid #ddd; padding: 8px;">Feature</th>
<th style="border: 1px solid #ddd; padding: 8px;">Specification</th>
</tr>
</thead>
<tbody>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">Battery Life</td>
<td style="border: 1px solid #ddd; padding: 8px;">30 hours</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">Noise Cancellation</td>
<td style="border: 1px solid #ddd; padding: 8px;">Active ANC</td>
</tr>
</tbody>
</table>

<p><em>Order now and get free shipping!</em></p>`
  },
  {
    name: "Documentation",
    content: `<h1>API Documentation</h1>
<blockquote>
<p>This documentation covers the basic usage of our REST API.</p>
</blockquote>

<h2>Getting Started</h2>
<p>To use the API, you'll need to:</p>
<ol>
<li>Register for an API key</li>
<li>Include the key in your request headers</li>
<li>Make requests to the endpoints</li>
</ol>

<h3>Authentication</h3>
<pre><code class="language-javascript">
const response = await fetch('/api/data', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});
</code></pre>

<p>For more information, see our <a href="/docs/auth">authentication guide</a>.</p>`
  }
];

export default function PlaygroundPage() {
  const [selectedConfig, setSelectedConfig] = useState("standard");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [viewMode, setViewMode] = useState<"editor" | "preview" | "code">("editor");
  const t = useTranslations("Playground");

  // Mock SunEditor initialization
  useEffect(() => {
    // In a real implementation, this would initialize SunEditor
    console.log("Initializing SunEditor with config:", selectedConfig);
  }, [selectedConfig]);

  const loadTemplate = (template: typeof templates[0]) => {
    setEditorContent(template.content);
    setSelectedTemplate(template.name);
  };

  const clearEditor = () => {
    setEditorContent("");
    setSelectedTemplate(null);
  };

  const copyContent = () => {
    navigator.clipboard.writeText(editorContent);
  };

  const sharePlayground = () => {
    const shareData = {
      config: selectedConfig,
      content: editorContent
    };
    const shareUrl = `${window.location.origin}/playground?data=${btoa(JSON.stringify(shareData))}`;
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="container mx-auto px-6 py-8 border-b">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
        >
          <div>
            <Badge variant="secondary" className="mb-2">
              <Play className="mr-2 h-4 w-4" />
              Live Playground
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              SunEditor Playground
            </h1>
            <p className="text-muted-foreground mt-2">
              Try out SunEditor features in real-time. Configure settings, load templates, and see the results instantly.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={sharePlayground}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={clearEditor}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </motion.div>
      </section>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Configuration Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Presets */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5" />
                  Configuration Presets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(presetConfigs).map(([key, config]) => (
                  <Button
                    key={key}
                    variant={selectedConfig === key ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedConfig(key)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{config.name}</div>
                      <div className="text-xs text-muted-foreground">{config.description}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Templates */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Type className="h-5 w-5" />
                  Sample Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {templates.map((template) => (
                  <Button
                    key={template.name}
                    variant={selectedTemplate === template.name ? "default" : "outline"}
                    className="w-full justify-start text-left"
                    onClick={() => loadTemplate(template)}
                  >
                    {template.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full" onClick={copyContent}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy HTML
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Editor Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    Editor
                    {selectedTemplate && (
                      <Badge variant="secondary" className="text-xs">
                        {selectedTemplate}
                      </Badge>
                    )}
                  </CardTitle>
                  <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
                    <TabsList className="h-8">
                      <TabsTrigger value="editor" className="text-xs px-2 py-1">
                        <Type className="mr-1 h-3 w-3" />
                        Edit
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="text-xs px-2 py-1">
                        <Eye className="mr-1 h-3 w-3" />
                        Preview
                      </TabsTrigger>
                      <TabsTrigger value="code" className="text-xs px-2 py-1">
                        <Code2 className="mr-1 h-3 w-3" />
                        HTML
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {viewMode === "editor" && (
                  <div className="h-[600px] bg-background">
                    {/* Mock Toolbar */}
                    <div className="flex items-center gap-1 p-2 bg-muted/50 border-b text-xs">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Type className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Palette className="h-3 w-3" />
                        </Button>
                        <Separator orientation="vertical" className="h-4" />
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Table className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <ImageIcon className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Link className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Mock Editor Area */}
                    <div className="p-4 h-full bg-white">
                      {selectedTemplate ? (
                        <div
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{ __html: editorContent }}
                        />
                      ) : (
                        <div className="text-muted-foreground flex items-center justify-center h-full">
                          <div className="text-center">
                            <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Start typing or load a template to begin</p>
                            <p className="text-sm mt-2">This is a mock editor. In the real implementation, SunEditor would load here.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {viewMode === "preview" && (
                  <div className="h-[600px] p-4 bg-white overflow-auto">
                    {editorContent ? (
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: editorContent }}
                      />
                    ) : (
                      <div className="text-muted-foreground text-center h-full flex items-center justify-center">
                        <div>
                          <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No content to preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {viewMode === "code" && (
                  <div className="h-[600px]">
                    <pre className="p-4 text-sm bg-muted/30 h-full overflow-auto">
                      <code>{editorContent || "// No content to display"}</code>
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>Playground Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Settings className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-medium mb-2">Live Configuration</h3>
                  <p className="text-sm text-muted-foreground">
                    Switch between different toolbar configurations instantly
                  </p>
                </div>
                <div className="text-center">
                  <Type className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-medium mb-2">Sample Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Load pre-built templates to see features in action
                  </p>
                </div>
                <div className="text-center">
                  <Share2 className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-medium mb-2">Share & Export</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your playground configurations with others
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}