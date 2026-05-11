const WEB3FORMS_ACCESS_KEY = '00ad7029-a7b8-4e91-977b-218336ce3db0';

function setCurrentYear() {
  const yearNodes = document.querySelectorAll('[data-current-year]');
  const currentYear = new Date().getFullYear().toString();

  yearNodes.forEach(
    function updateYear(node) {
      node.textContent = currentYear;
    }
  );
}

function setFormStatus(statusNode, message, statusType) {
  if (!statusNode) return;

  statusNode.textContent = message;
  statusNode.classList.remove('error', 'success');
  if (statusType) {
    statusNode.classList.add(statusType);
  }
}

function installSupportForms() {
  const forms = document.querySelectorAll('[data-web3forms-form]');

  forms.forEach(function installSupportForm(form) {
    const statusNode = form.querySelector('[data-form-status]');
    const submitButton = form.querySelector('[type="submit"]');
    const accessKeyInput = form.querySelector('[name="access_key"]');

    if (accessKeyInput) {
      accessKeyInput.value = WEB3FORMS_ACCESS_KEY;
    }

    form.addEventListener('submit', async function submitSupportRequest(event) {
      event.preventDefault();

      setFormStatus(statusNode, 'Sending your request...', '');
      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: new FormData(form),
        });

        const result = await response.json().catch(function readEmptyResponse() {
          return {};
        });

        if (!response.ok || result.success === false) {
          throw new Error(result.message || 'Unable to send your request.');
        }

        form.reset();
        if (accessKeyInput) {
          accessKeyInput.value = WEB3FORMS_ACCESS_KEY;
        }

        setFormStatus(
          statusNode,
          'Sent. We will review your request as soon as possible.',
          'success',
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to send your request. Please try again.';
        setFormStatus(statusNode, message, 'error');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  });
}

setCurrentYear();
installSupportForms();
