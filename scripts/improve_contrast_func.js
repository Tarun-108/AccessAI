function getEffectiveBackgroundColor(rgbColor) {
  if (
    rgbColor[0] == 0 &&
    rgbColor[1] == 0 &&
    rgbColor[2] == 0 &&
    rgbColor[3] == 0
  ) {
    return [255, 255, 255, 1];
  }
  return rgbColor;
}

function parseColor(color) {
  const rgbaRegex =
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d*\.?\d+))?\s*\)$/;

  const match = color.match(rgbaRegex);

  if (!match) {
    throw new Error(
      "Invalid color format. Expected rgb(r, g, b) or rgba(r, g, b, a)."
    );
  }

  const red = parseInt(match[1], 10);
  const green = parseInt(match[2], 10);
  const blue = parseInt(match[3], 10);
  const alpha = match[4] !== undefined ? parseFloat(match[4]) : 1; // Default alpha to 1 if not provided

  return [red, green, blue, alpha];
}

function luminance(r, g, b) {
  var a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function improveTextColor(textColor, bgColor) {
  let clrTxt = parseColor(textColor),
    clrBG = parseColor(bgColor);
  clrBG = getEffectiveBackgroundColor(clrBG);

  const color1luminance = luminance(...clrTxt);
  const color2luminance = luminance(...clrBG);

  let contrastRatio =
    color1luminance > color2luminance
      ? (color2luminance + 0.05) / (color1luminance + 0.05)
      : (color1luminance + 0.05) / (color2luminance + 0.05);
  if (contrastRatio >= 4.5) {
    return textColor;
  }

  let [adjustedR, adjustedG, adjustedB] = clrTxt;
  console.log(clrTxt);

  let lighten = contrastRatio < 1;

  while (contrastRatio < 4.5) {
    if (lighten) {
      adjustedR = Math.min(255, adjustedR + 10);
      adjustedG = Math.min(255, adjustedG + 10);
      adjustedB = Math.min(255, adjustedB + 10);
    } else {
      adjustedR = Math.max(0, adjustedR - 10);
      adjustedG = Math.max(0, adjustedG - 10);
      adjustedB = Math.max(0, adjustedB - 10);
    }

    const newLuminance = luminance(adjustedR, adjustedG, adjustedB);
    contrastRatio =
      (Math.max(newLuminance, color2luminance) + 0.05) /
      (Math.min(newLuminance, color2luminance) + 0.05);

    if (
      adjustedR === 255 &&
      adjustedG === 255 &&
      adjustedB === 255 &&
      lighten
    ) {
      lighten = false;
    } else if (
      adjustedR === 0 &&
      adjustedG === 0 &&
      adjustedB === 0 &&
      !lighten
    ) {
      break;
    }
  }

  return `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`;
}
