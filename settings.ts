import MagicTasksPlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class MagicTasksSettingTab extends PluginSettingTab {
	plugin: MagicTasksPlugin;

	constructor(app: App, plugin: MagicTasksPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("API Provider")
			.setDesc("Select the API provider")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("openai", "OpenAI")
					.addOption("ollama", "Ollama")
					.setValue(this.plugin.settings.api_select || "openai")
					.onChange(async (value) => {
						this.plugin.settings.api_select = value;
						await this.plugin.saveSettings();
						this.display();
					})
			);

		new Setting(containerEl)
			.setName("OpenAI API Key")
			.setDesc("Provide your key to use the OpenAI API")
			.addText((text) =>
				text
					.setPlaceholder("sk-XXXXXX")
					.setValue(this.plugin.settings.openai_key)
					.onChange(async (value) => {
						this.plugin.settings.openai_key = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("OpenAI Model")
			.setDesc("Provide the name of the OpenAI model")
			.addText((text) =>
				text
					.setPlaceholder("gpt-3.5-turbo")
					.setValue(this.plugin.settings.openai_model)
					.onChange(async (value) => {
						this.plugin.settings.openai_model = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Ollama URL")
			.setDesc(
				"Provide the URL for the Ollama API (include trailing slash)"
			)
			.addText((text) =>
				text
					.setPlaceholder("http://127.0.0.1:11434/")
					.setValue(this.plugin.settings.ollama_url)
					.onChange(async (value) => {
						this.plugin.settings.ollama_url = value;
						await this.plugin.saveSettings();
					})
			);

      new Setting(containerEl)
        .setName("Ollama Model")
        .setDesc("Provide the name of the Ollama model")
        .addText((text) =>
          text
            .setPlaceholder("llama3")
            .setValue(this.plugin.settings.ollama_model)
            .onChange(async (value) => {
              this.plugin.settings.ollama_model = value;
              await this.plugin.saveSettings();
            })
        );

        new Setting(containerEl)
          .setName("System prompt")
          .setDesc("Context and guidelines to pass on to the LLM")
          .addText((text) =>
            text
              .setPlaceholder("You are a helpful assistant that responds with markdown-formatted tasks in the format `- [ ] This is a subtask`. Please only respond with tasks, no other text.")
              .setValue(this.plugin.settings.system_prompt)
              .onChange(async (value) => {
                this.plugin.settings.system_prompt = value;
                await this.plugin.saveSettings();
              })
          );

          new Setting(containerEl)
            .setName("User prompt")
            .setDesc("Instructions to pass on to the LLM")
            .addText((text) =>
              text
                .setPlaceholder("Please break down the following task into smaller subtasks: ")
                .setValue(this.plugin.settings.user_prompt)
                .onChange(async (value) => {
                  this.plugin.settings.user_prompt = value;
                  await this.plugin.saveSettings();
                })
            );
	}
}
