---
name: Bug report
about: Create a report about your TOC not generating correctly

---

**My Markdown**

<!--
  Put the markdown you've written and is currently being fed into the
  `html` parameter. Only the headings are necessary and in the order
  you're using them.
-->

```markdown

```

**TOC Usage**

<!--
  How are you using the toc.html include?

  Specify the parameters you're using in your {% include %}; that means
  values you're setting for `h_min`, `sanitize`, etc.
-->

```liquid
{% include toc.html html=content %}
```

**Expected TOC**

<!--
  The HTML of the TOC you expected to see
-->

```html

```

**Actual TOC**

<!--
  The HTML you got instead
-->

```html

```

**Notes**

<!--
  If there's anything else you'd like to say or would be useful, here's
  your chance to say it.
-->

Write here.
