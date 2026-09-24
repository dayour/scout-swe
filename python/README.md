# scout-swe (Python bindings)

```bash
pip install ./python   # from the repo root, or: pip install scout-swe (once published)
```

```python
import os
from scout_swe import ScoutClient, ScoutPolicy

with ScoutClient(os.environ["SCOUT_GATEWAY"]) as scout:
    print(scout.health())
    for node in scout.nodes():
        print(node.id, node.platform, node.status)

    # Render the Linux managed policy that enables Frontier
    policy = ScoutPolicy(allowScoutFrontierAccess=True)
    print(scout.render_policy("linux", policy))
```

Set `SCOUT_GATEWAY` to the deployment-specific control-plane origin.
