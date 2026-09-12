import re

with open('src/hooks/usePricingEngine.ts', 'r') as f:
    content = f.read()

getSrvCost_code = """
  const getServiceUnitPrice = (s: string, item: any): number => {
    if (!pricing) return 0;
    const srvDef = pricing.services?.find((x: any) => x.name === s);
    if (srvDef?.type === 'Escala de Volumen (Logos)' || (!srvDef && s.toUpperCase().includes('LOGO'))) { 
       return calculateVolumeScaledServiceUnitPrice(item.qty || 1);
    }
    const customPrice = (item.customServicePrices && item.customServicePrices[s] !== undefined) ? Number(item.customServicePrices[s]) : (srvDef?.price || 0);
    return Number(customPrice) || 0;
  };
"""

# inject getServiceUnitPrice after getItemUnitPrice
content = content.replace("const calculateItemPriceRaw = ", getSrvCost_code + "\n  const calculateItemPriceRaw = ")

# use it inside calculateItemPriceRaw
# originally: 
#     const getSrvCost = (s: string) => {
#       const srvDef = pricing.services?.find((x: any) => x.name === s);
#       if (srvDef?.type === 'Escala de Volumen (Logos)' || (!srvDef && s.toUpperCase().includes('LOGO'))) { 
#          return calculateVolumeScaledServiceUnitPrice(item.qty || 1);
#       }
#       const customPrice = (item.customServicePrices && item.customServicePrices[s] !== undefined) ? Number(item.customServicePrices[s]) : (srvDef?.price || 0);
#       return Number(customPrice) || 0;
#     };
#    const srvTotal = item.services?.reduce((a: number, s: string) => { 
#       return a + getSrvCost(s);
#    }, 0) || 0;

content = re.sub(
    r"const getSrvCost = \(s: string\) => \{.*?\};", 
    "const getSrvCost = (s: string) => getServiceUnitPrice(s, item);", 
    content, flags=re.DOTALL
)

content = content.replace("getItemUnitPrice,", "getItemUnitPrice,\n    getServiceUnitPrice,")

with open('src/hooks/usePricingEngine.ts', 'w') as f:
    f.write(content)
