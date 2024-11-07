import { readFile, writeFile } from "node:fs/promises";
import { parse } from "hjson";
import { readdirSync, readFileSync } from "node:fs";
import { Guns, Melees, Throwables } from "@common/definitions";

export const REFERNCE_LANGUAGE = "en";

export const LANGUAGES_DIRECTORY = "../languages/"

const files = readdirSync(LANGUAGES_DIRECTORY).filter(file => file.endsWith(".hjson"));

const keyFilter = (key: string) => (
  key !== "name" &&
  key !== "flag" &&
  key !== "mandatory" &&
  !Guns.hasString(key) &&
  !Melees.hasString(key) &&
  !Throwables.hasString(key)
)

const ValidKeys = Object.keys(parse(readFileSync(LANGUAGES_DIRECTORY + REFERNCE_LANGUAGE + ".hjson", "utf8")))
  .filter(keyFilter)

export type TranslationsManifest = Record<string, {
  readonly name: string,
  readonly flag: string,
  readonly percentage: string,
  /** Loading the language is required on client */
  readonly mandatory?: boolean
}>

export async function validateTranslations() {
  let reportBuffer = `# Translation File Reports

This file is a report of all errors and missing keys in the translation files of this game. Last generated ${new Date(Date.now()).toUTCString()}

`

  const referenceKeys = Object.keys(parse(await readFile(LANGUAGES_DIRECTORY + REFERNCE_LANGUAGE + ".hjson", "utf8")) satisfies Record<string, string>)
    .filter(keyFilter);

  const parsedFiles = await Promise.all(files.filter(file => file !== REFERNCE_LANGUAGE + ".hjson")
    .map(async file => [file, parse(await readFile(LANGUAGES_DIRECTORY + file, "utf8"))] as [string, Record<string, string>]));

  for (const [filename, content] of parsedFiles) {
    const keys = Object.keys(content).filter(keyFilter);

    let languageReportBuffer = `## ${content.flag} ${content.name} (${Math.round(100 * keys.length / referenceKeys.length)}) - ${filename}\n\n`;

    // Mutate this to false when a test fails
    let flawless = true;

    // Find invalid keys
    languageReportBuffer += `### Invalid Keys\n\n`
    for (const key of keys) {
      if (referenceKeys.includes(key)) continue;
      flawless = false;
      languageReportBuffer += `-Key \`${key}\` is not a valid key\n`
    }

    // Find undefined keys
    languageReportBuffer += `### Undefined Keys\n\n`
    for (const referenceKey of referenceKeys) {
      if (keys.includes(referenceKey)) continue;
      flawless = false;
      languageReportBuffer += `Key \`${referenceKey}\` is not defined\n`
    }

    reportBuffer += languageReportBuffer;
  }

  await writeFile("../README.md", reportBuffer);
}

export async function buildTranslations() {
  const languages: Record<string, string> = {}
  await Promise.all(files.map(async file => {
    languages[file.slice(0, -".hjson")] = parse(await readFile(LANGUAGES_DIRECTORY + file, "utf8"))
  }))
}

buildTranslations();
