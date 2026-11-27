// Capacity Planner: works out units per day and per week from the form values.
(function () {
  // Rules for each field. "label" is used in error messages.
  var FIELDS = {
    machines:   { id: "machines",   label: "Machines",         min: 1, max: 1000, integer: true },
    cycleTime:  { id: "cycle-time", label: "Cycle time",       min: 0, minExclusive: true },
    shifts:     { id: "shifts",     label: "Shifts per day",   min: 1, max: 24, integer: true },
    hours:      { id: "hours",      label: "Hours per shift",  min: 0, minExclusive: true, max: 24 },
    efficiency: { id: "efficiency", label: "Efficiency",       min: 1, max: 100 },
    downtime:   { id: "downtime",   label: "Downtime",         min: 0, max: 99 },
    days:       { id: "days",       label: "Working days",     min: 1, max: 7, integer: true }
  };

  function $(id) {
    return document.getElementById(id);
  }

  // Show a number with thousands separators and at most `digits` decimals.
  function fmt(n, digits) {
    return n.toLocaleString("en-US", { maximumFractionDigits: digits === undefined ? 2 : digits });
  }

  // Returns an error message for one field, or "" if the value is fine.
  function check(field, raw) {
    if (raw.trim() === "") return "Enter a number.";
    var value = Number(raw);
    if (!isFinite(value)) return "Enter a number.";
    if (field.integer && Math.floor(value) !== value) return "Use a whole number.";
    if (field.minExclusive ? value <= field.min : value < field.min) {
      return field.minExclusive
        ? "Must be more than " + field.min + "."
        : "Must be at least " + field.min + ".";
    }
    if (field.max !== undefined && value > field.max) return "Must be " + field.max + " or less.";
    return "";
  }

  function setError(field, message) {
    var input = $(field.id);
    $(field.id + "-error").textContent = message;
    if (message) {
      input.setAttribute("aria-invalid", "true");
    } else {
      input.removeAttribute("aria-invalid");
    }
  }

  function addStep(list, text) {
    var li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  }

  function update() {
    var values = {};
    var valid = true;

    Object.keys(FIELDS).forEach(function (key) {
      var field = FIELDS[key];
      var raw = $(field.id).value;
      var message = check(field, raw);
      setError(field, message);
      if (message) valid = false;
      else values[key] = Number(raw);
    });

    // A day only has 24 hours, so shifts x hours must fit.
    if (valid && values.shifts * values.hours > 24) {
      setError(FIELDS.hours, "Shifts times hours cannot be more than 24 hours a day.");
      valid = false;
    }

    $("results-body").hidden = !valid;
    $("results-empty").hidden = valid;
    if (!valid) return;

    var seconds = $("cycle-unit").value === "seconds";
    var cycleMinutes = seconds ? values.cycleTime / 60 : values.cycleTime;

    var availableMinutes = values.shifts * values.hours * 60;
    var usableMinutes =
      availableMinutes * (1 - values.downtime / 100) * (values.efficiency / 100);
    var perMachine = usableMinutes / cycleMinutes;
    var total = perMachine * values.machines;
    var perDay = Math.floor(total);
    var perWeek = perDay * values.days;

    $("units-day").textContent = fmt(perDay, 0);
    $("units-week").textContent = fmt(perWeek, 0);

    var steps = $("steps");
    steps.textContent = "";
    addStep(steps,
      "Time available each day: " + fmt(values.shifts) + " shifts × " + fmt(values.hours) +
      " hours × 60 = " + fmt(availableMinutes) + " minutes.");
    addStep(steps,
      "Time actually usable: remove " + fmt(values.downtime) + "% downtime, then apply " +
      fmt(values.efficiency) + "% efficiency. " + fmt(availableMinutes) + " × " +
      fmt(1 - values.downtime / 100, 4) + " × " + fmt(values.efficiency / 100, 4) +
      " = " + fmt(usableMinutes) + " minutes per machine.");
    if (seconds) {
      addStep(steps,
        "Cycle time in minutes: " + fmt(values.cycleTime) + " seconds ÷ 60 = " +
        fmt(cycleMinutes, 4) + " minutes per unit.");
    }
    addStep(steps,
      "Units one machine makes in a day: " + fmt(usableMinutes) + " ÷ " + fmt(cycleMinutes, 4) +
      " = " + fmt(perMachine) + " units.");
    addStep(steps,
      "All machines together: " + fmt(perMachine) + " × " + fmt(values.machines) + " = " +
      fmt(total) + ", rounded down to " + fmt(perDay, 0) + " units per day.");
    addStep(steps,
      "Per week: " + fmt(perDay, 0) + " × " + fmt(values.days) + " working days = " +
      fmt(perWeek, 0) + " units.");
  }

  var form = $("planner-form");
  form.addEventListener("input", update);
  form.addEventListener("change", update);
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });
  update();
})();
