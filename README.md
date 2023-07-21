# Magic Tasks

This plugin is inspired by goblin.tools's [Magic ToDo](https://goblin.tools/).

Click on a task in Obsidian, press `Ctrl + M` (or `Command + M` on a Mac) to ask ChatGPT to break down the task into smaller sub-tasks. You can change the shortcut to something else if you prefer.

![Screen recording of Magic Tasks in action](https://raw.githubusercontent.com/nicucalcea/obsidian-magic-tasks/master/magic-tasks-demo.gif)

On mobile, tap on the task you want to break down and pull down to open the menu of actions. Search for `Magic Tasks` and you get it from there.

### Installation

Download the latest release and copy the `main.js` and `manifest.json` files to a new folder called `magic-tasks` in `VaultFolder/.obsidian/plugins/`. Enable it from `Community plugins`.

Alternatively, you can install it by just copying the link into [BRAT](https://github.com/TfTHacker/obsidian42-brat).

### Disclaimer

You will need an [OpenAI API key](https://platform.openai.com/docs/api-reference) for this work. This also means your task will be sent to the OpenAI servers for processing. Read [their privacy policy](https://openai.com/policies/api-data-usage-policies) to see how they handle your data.

There's also a cost associated, although I can't say how much each query will cost. Under $0.01, from my experience.

ChatGPT itself was heavily involved in writing this plugin.