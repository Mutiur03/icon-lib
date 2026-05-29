"use client";

import { Edit2, Plus, RotateCcw, Save, Trash2, Upload } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { TECHNOLOGY_CATEGORIES } from "@/lib/technology/categories";
import { normalizeTechnologyId, resolveTechnologyIcon } from "@/lib/technology/sources";
import type { ResolvedTechnology, TechnologyCategory, TechnologyRecord, TechnologySource } from "@/lib/technology/types";
import { TechnologyIcon } from "./TechnologyIcon";

const storageKey = "technology-icon-library.registry";

const emptyForm: TechnologyRecord = {
  id: "",
  name: "",
  category: "other",
  source: "custom",
  iconUrl: "",
  featured: false,
  iconSources: {}
};

export function AdminTechnologyManager({ initialTechnologies }: { initialTechnologies: ResolvedTechnology[] }) {
  const [items, setItems] = useState<TechnologyRecord[]>(initialTechnologies);
  const [form, setForm] = useState<TechnologyRecord>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        setItems(JSON.parse(saved) as TechnologyRecord[]);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const resolvedItems = useMemo(() => items.map(resolveTechnologyIcon), [items]);
  const registryJson = useMemo(() => JSON.stringify(items, null, 2), [items]);

  function updateField<K extends keyof TechnologyRecord>(key: K, value: TechnologyRecord[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateSource(source: TechnologySource, value: string) {
    setForm((current) => ({
      ...current,
      source,
      iconUrl: value,
      iconSources: { ...current.iconSources, [source]: value }
    }));
  }

  function saveTechnology(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = form.id || normalizeTechnologyId(form.name);
    if (!id || !form.name.trim()) return;

    const next: TechnologyRecord = {
      ...form,
      id,
      name: form.name.trim(),
      iconSources: form.iconSources ?? { [form.source]: form.iconUrl }
    };

    setItems((current) => {
      const exists = current.some((item) => item.id === editingId || item.id === id);
      if (!exists) return [...current, next].sort((a, b) => a.name.localeCompare(b.name));
      return current.map((item) => (item.id === editingId || item.id === id ? next : item));
    });
    setForm(emptyForm);
    setEditingId(null);
  }

  function editTechnology(technology: TechnologyRecord) {
    setEditingId(technology.id);
    setForm({ ...technology, iconSources: { ...technology.iconSources } });
  }

  function removeTechnology(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
  }

  function resetRegistry() {
    setItems(initialTechnologies);
    setForm(emptyForm);
    setEditingId(null);
    window.localStorage.removeItem(storageKey);
  }

  async function persistRegistry() {
    setStatus("Saving...");
    const response = await fetch("/api/technologies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items)
    });
    if (!response.ok) {
      setStatus("Save failed.");
      return;
    }
    setStatus(`Saved ${items.length} technologies to JSON.`);
  }

  function uploadSvg(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateSource("custom", String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <section className="section admin-panel" aria-labelledby="admin-heading">
      <h2 id="admin-heading">Admin Registry</h2>
      <p className="admin-note">
        Browser admin stores draft edits in localStorage and can save the registry back to
        `src/data/technologies.json` during local development.
      </p>
      <div className="admin-layout">
        <form className="admin-form" onSubmit={saveTechnology}>
          <h3>{editingId ? "Edit technology" : "Add technology"}</h3>
          <div className="form-grid">
            <input
              className="field"
              value={form.name}
              onChange={(event) => {
                const name = event.target.value;
                setForm((current) => ({
                  ...current,
                  name,
                  id: editingId ? current.id : normalizeTechnologyId(name)
                }));
              }}
              placeholder="Name"
              required
            />
            <input
              className="field"
              value={form.id}
              onChange={(event) => updateField("id", normalizeTechnologyId(event.target.value))}
              placeholder="id"
              required
            />
            <select
              className="select"
              value={form.category}
              onChange={(event) => updateField("category", event.target.value as TechnologyCategory)}
            >
              {TECHNOLOGY_CATEGORIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <select
              className="select"
              value={form.source}
              onChange={(event) => updateSource(event.target.value as TechnologySource, form.iconUrl)}
            >
              <option value="custom">Custom</option>
              <option value="skillicon">SkillIcons</option>
              <option value="devicon">Devicon</option>
              <option value="simpleicon">Simple Icons</option>
            </select>
            <input
              className="field"
              value={form.iconUrl}
              onChange={(event) => updateSource(form.source, event.target.value)}
              placeholder="Icon URL or provider slug"
            />
            <input
              className="field"
              value={form.color ?? ""}
              onChange={(event) => updateField("color", event.target.value)}
              placeholder="#52d6b8"
            />
            <label className="toggle">
              <input
                type="checkbox"
                checked={Boolean(form.featured)}
                onChange={(event) => updateField("featured", event.target.checked)}
              />
              Featured
            </label>
            <label className="button">
              <Upload size={16} aria-hidden="true" />
              Upload SVG
              <input className="sr-only" type="file" accept=".svg,image/svg+xml" onChange={uploadSvg} />
            </label>
            <div className="button-row">
              <button className="button primary" type="submit">
                {editingId ? <Save size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                {editingId ? "Save" : "Add"}
              </button>
              <button className="button" type="button" onClick={() => setForm(emptyForm)}>
                Clear
              </button>
              <button className="button danger" type="button" onClick={resetRegistry}>
                <RotateCcw size={16} aria-hidden="true" />
                Reset
              </button>
            </div>
          </div>
        </form>

        <div className="admin-list">
          <h3>Editable registry</h3>
          <div className="button-row admin-save-row">
            <button className="button primary" type="button" onClick={persistRegistry}>
              <Save size={16} aria-hidden="true" />
              Save JSON
            </button>
            {status ? <span className="meta">{status}</span> : null}
          </div>
          <div className="admin-items">
            {resolvedItems.map((technology) => (
              <div className="admin-item" key={technology.id}>
                <TechnologyIcon technology={technology} size={34} />
                <div className="tech-label">
                  <strong>{technology.name}</strong>
                  <span>{technology.category}</span>
                  <span>Source: {getSourceLabel(technology.resolvedSource)}</span>
                </div>
                <div className="admin-actions">
                  <button className="button" type="button" onClick={() => editTechnology(technology)}>
                    <Edit2 size={15} aria-hidden="true" />
                    <span className="sr-only">Edit {technology.name}</span>
                  </button>
                  <button className="button danger" type="button" onClick={() => removeTechnology(technology.id)}>
                    <Trash2 size={15} aria-hidden="true" />
                    <span className="sr-only">Delete {technology.name}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <textarea className="textarea registry-json" readOnly value={registryJson} aria-label="Registry JSON export" />
        </div>
      </div>
    </section>
  );
}

function getSourceLabel(source: ResolvedTechnology["resolvedSource"]) {
  switch (source) {
    case "custom":
      return "Custom";
    case "skillicon":
      return "SkillIcons";
    case "devicon":
      return "Devicon";
    case "simpleicon":
      return "Simple Icons";
    default:
      return "Fallback";
  }
}
