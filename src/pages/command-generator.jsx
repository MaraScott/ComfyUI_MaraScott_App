import { Helmet } from 'react-helmet-async';

import { GeneratorView } from 'src/sections/command-generator';

// ----------------------------------------------------------------------

export default function CommandGeneratorPage() {
  return (
    <>
      <Helmet>
        <title> ComfyUI </title>
      </Helmet>

      <GeneratorView />
    </>
  );
}
