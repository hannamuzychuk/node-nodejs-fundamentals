const dynamic = async () => {
 
  const pluginName = process.argv[2];

  if (!pluginName) {
    console.log('Plugin not specified');
    process.exit(1);
  }
  try {
    const plugin = await import(`./plugins/${pluginName}.js`);

    if (typeof plugin.run !== "function") {
      console.log('Plugin is invalid (missing run function)');
       process.exit(1);
    }

    const result = plugin.run();
    console.log(result);
  } catch (error) {
    console.log('Plugin not found');
     process.exit(1);
  }

};

await dynamic();
