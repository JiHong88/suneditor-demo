"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, Star, ExternalLink, ArrowRight, Zap, Code2, Settings, Puzzle, Globe, Shield, Download, FileText, Video, Headphones, Clock, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const documentationSections = {
  "getting-started": {
    title: "Getting Started",
    icon: <Zap className="h-5 w-5" />,
    description: "Quick start guides and basic setup",
    items: [
      { title: "Installation", href: "/docs/installation", description: "How to install SunEditor via npm, yarn, or CDN" },
      { title: "Basic Usage", href: "/docs/basic-usage", description: "Create your first editor instance" },
      { title: "Configuration", href: "/docs/configuration", description: "Essential configuration options" },
      { title: "First Steps", href: "/docs/first-steps", description: "Common patterns and best practices" },
      { title: "Troubleshooting", href: "/docs/troubleshooting", description: "Common issues and solutions" }
    ]
  },
  "api-reference": {
    title: "API Reference",
    icon: <Code2 className="h-5 w-5" />,
    description: "Complete API documentation",
    items: [
      { title: "Core Methods", href: "/docs/api/core", description: "Editor creation, content manipulation, and control methods" },
      { title: "Events", href: "/docs/api/events", description: "Available events and callback functions" },
      { title: "Commands", href: "/docs/api/commands", description: "Built-in commands and custom command creation" },
      { title: "Utilities", href: "/docs/api/utilities", description: "Helper functions and utility methods" },
      { title: "TypeScript", href: "/docs/api/typescript", description: "Type definitions and TypeScript usage" }
    ]
  },
  "configuration": {
    title: "Configuration",
    icon: <Settings className="h-5 w-5" />,
    description: "Detailed configuration options",
    items: [
      { title: "Options Overview", href: "/docs/config/options", description: "Complete list of configuration options" },
      { title: "Toolbar Customization", href: "/docs/config/toolbar", description: "Customize toolbar buttons and layout" },
      { title: "Styling & Themes", href: "/docs/config/styling", description: "Custom CSS and theme configuration" },
      { title: "Language & i18n", href: "/docs/config/i18n", description: "Internationalization and language packs" },
      { title: "Performance Tuning", href: "/docs/config/performance", description: "Optimize for your use case" }
    ]
  },
  "plugins": {
    title: "Plugins",
    icon: <Puzzle className="h-5 w-5" />,
    description: "Plugin system and development",
    items: [
      { title: "Built-in Plugins", href: "/docs/plugins/builtin", description: "Documentation for all built-in plugins" },
      { title: "Plugin Development", href: "/docs/plugins/development", description: "Create custom plugins" },
      { title: "Plugin API", href: "/docs/plugins/api", description: "Plugin development API reference" },
      { title: "Community Plugins", href: "/docs/plugins/community", description: "Third-party plugins and extensions" },
      { title: "Plugin Examples", href: "/docs/plugins/examples", description: "Real-world plugin examples" }
    ]
  },
  "frameworks": {
    title: "Framework Integration",
    icon: <Globe className="h-5 w-5" />,
    description: "Integration with popular frameworks",
    items: [
      { title: "React", href: "/docs/frameworks/react", description: "suneditor-react integration guide" },
      { title: "Vue.js", href: "/docs/frameworks/vue", description: "Vue component integration" },
      { title: "Angular", href: "/docs/frameworks/angular", description: "Angular component wrapper" },
      { title: "Next.js & SSR", href: "/docs/frameworks/nextjs", description: "Server-side rendering setup" },
      { title: "Svelte", href: "/docs/frameworks/svelte", description: "Svelte component integration" }
    ]
  },
  "advanced": {
    title: "Advanced Topics",
    icon: <Shield className="h-5 w-5" />,
    description: "Security, performance, and advanced usage",
    items: [
      { title: "Content Security Policy", href: "/docs/advanced/csp", description: "CSP configuration and nonce handling" },
      { title: "Security Best Practices", href: "/docs/advanced/security", description: "XSS prevention and content sanitization" },
      { title: "Performance Optimization", href: "/docs/advanced/performance", description: "Optimize for large documents" },
      { title: "Custom File Upload", href: "/docs/advanced/file-upload", description: "Implement secure file upload handling" },
      { title: "Content Migration", href: "/docs/advanced/migration", description: "Migrate from other editors" }
    ]
  }
};

const quickLinks = [
  { title: "Installation Guide", href: "/docs/installation", icon: <Download className="h-4 w-4" />, popular: true },
  { title: "API Reference", href: "/docs/api", icon: <Code2 className="h-4 w-4" />, popular: true },
  { title: "Plugin Development", href: "/docs/plugins/development", icon: <Puzzle className="h-4 w-4" />, popular: true },
  { title: "React Integration", href: "/docs/frameworks/react", icon: <Globe className="h-4 w-4" />, popular: false },
  { title: "Security Guide", href: "/docs/advanced/security", icon: <Shield className="h-4 w-4" />, popular: false },
  { title: "Performance Tips", href: "/docs/advanced/performance", icon: <Zap className="h-4 w-4" />, popular: false }
];

const resources = [
  {
    title: "Video Tutorials",
    icon: <Video className="h-8 w-8" />,
    description: "Step-by-step video guides",
    items: ["Getting Started", "Plugin Development", "Advanced Features"],
    href: "/docs/videos"
  },
  {
    title: "Audio Guides",
    icon: <Headphones className="h-8 w-8" />,
    description: "Podcast-style technical discussions",
    items: ["Architecture Deep Dive", "Performance Tips", "Best Practices"],
    href: "/docs/audio"
  },
  {
    title: "Examples & Demos",
    icon: <FileText className="h-8 w-8" />,
    description: "Ready-to-use code examples",
    items: ["Basic Setup", "Custom Plugins", "Framework Integration"],
    href: "/docs/examples"
  }
];

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState("getting-started");
  const t = useTranslations("Docs");

  const filteredSections = Object.entries(documentationSections).filter(([key, section]) =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.items.some(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <section className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Badge variant="secondary" className="mb-4">
            <BookOpen className="mr-2 h-4 w-4" />
            Documentation
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            SunEditor Documentation
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Complete documentation, guides, and API reference for SunEditor v3. Find everything you need to build amazing editing experiences.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto mt-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>
      </section>

      <div className="container mx-auto px-6 pb-20">
        {/* Quick Links */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold mb-8">Popular Pages</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Card key={link.href} className="group hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {link.icon}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="font-medium group-hover:text-primary transition-colors">
                          {link.title}
                        </span>
                        {link.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                      </div>
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Documentation Sections */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold mb-8">Documentation Sections</h2>

          {filteredSections.map(([key, section]) => (
            <Card key={key} className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {section.icon}
                  {section.title}
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {section.items.map((item) => (
                    <div key={item.href} className="group">
                      <a
                        href={item.href}
                        className="block p-4 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium group-hover:text-primary transition-colors">
                            {item.title}
                          </h4>
                          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredSections.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try searching for something else or browse the sections above.
                </p>
              </CardContent>
            </Card>
          )}
        </motion.section>

        {/* Resources */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold mb-8">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Card key={resource.href} className="group hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-primary">
                      {resource.icon}
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </div>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 mb-4">
                    {resource.items.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm" asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <a href={resource.href}>
                      Explore
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Community & Support */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold mb-8">Community & Support</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Community Support
                </CardTitle>
                <CardDescription>
                  Get help from the community and contribute to discussions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://github.com/JiHong88/SunEditor/discussions" target="_blank">
                    GitHub Discussions
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://github.com/JiHong88/SunEditor/issues" target="_blank">
                    Report Issues
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://stackoverflow.com/questions/tagged/suneditor" target="_blank">
                    Stack Overflow
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  Stay Updated
                </CardTitle>
                <CardDescription>
                  Keep up with the latest updates and releases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/docs/changelog">
                    Changelog
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/docs/roadmap">
                    Roadmap
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://github.com/JiHong88/SunEditor/releases" target="_blank">
                    GitHub Releases
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-semibold mb-4">Can't Find What You're Looking For?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our documentation is constantly improving. If you can't find the information you need, let us know or contribute to make it better.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild>
                  <a href="https://github.com/JiHong88/SunEditor/discussions" target="_blank">
                    Ask the Community
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://github.com/JiHong88/SunEditor" target="_blank">
                    Contribute Docs
                  </a>
                </Button>
                <Button variant="ghost" asChild>
                  <a href="/playground">Try in Playground</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}