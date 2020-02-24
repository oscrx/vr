const SlaTable = (tenant) => {
  const sla = []
  const formatSla = []
  for (const env in tenant.vms) {
    sla[env] = { disk: 0, vcpus: 0, memory: 0, network_storage: 0 }
    for (const id in tenant.vms[env]) {
      sla[env].disk += tenant.vms[env][id].disk
      sla[env].vcpus += tenant.vms[env][id].vcpus
      sla[env].memory += tenant.vms[env][id].memory
      sla[env].network_storage += tenant.vms[env][id].network_storage || 0

      // save the totals
      global.total.disk += tenant.vms[env][id].disk
      global.total.vcpus += tenant.vms[env][id].vcpus
      global.total.memory += tenant.vms[env][id].memory
      global.total.network_storage += tenant.vms[env][id].network_storage || 0
    }
    if (env === 'production') {
      formatSla.push([
        'Productie omgeving*',
        sla[env].vcpus + ' / ' + tenant.custom_fields['sla-prod-vcpu'],
        (sla[env].memory / 1024).toFixed(0) + ' / ' + tenant.custom_fields['sla-prod-memory'],
        sla[env].disk + ' / ' + tenant.custom_fields['sla-prod-disk'],
        sla[env].network_storage + ' / ' + tenant.custom_fields['sla-prod-network-storage']
      ])
    } else if (env === 'accept') {
      formatSla.push([
        'Acceptatie omgeving*',
        sla[env].vcpus + ' / ' + tenant.custom_fields['sla-acc-vcpu'],
        (sla[env].memory / 1024).toFixed(0) + ' / ' + tenant.custom_fields['sla-acc-memory'],
        sla[env].disk + ' / ' + tenant.custom_fields['sla-acc-disk'],
        sla[env].network_storage + ' / ' + tenant.custom_fields['sla-acc-network-storage']
      ])
    } else if (env === 'testing') {
      formatSla.push([
        'Test omgeving*',
        sla[env].vcpus + ' / ' + tenant.custom_fields['sla-tst-vcpu'],
        (sla[env].memory / 1024).toFixed(0) + ' / ' + tenant.custom_fields['sla-tst-memory'],
        sla[env].disk + ' / ' + tenant.custom_fields['sla-tst-disk'],
        sla[env].network_storage + ' / ' + tenant.custom_fields['sla-tst-network-storage']
      ])
    } else if (env === 'demo') {
      formatSla.push([
        'Demo omgeving*',
        sla[env].vcpus + ' / ' + tenant.custom_fields['sla-dmo-vcpu'],
        (sla[env].memory / 1024).toFixed(0) + ' / ' + tenant.custom_fields['sla-dmo-memory'],
        sla[env].disk + ' / ' + tenant.custom_fields['sla-dmo-disk'],
        sla[env].network_storage + ' / ' + tenant.custom_fields['sla-dmo-network-storage']
      ])
    }
  }
  return formatSla.sort()
}

const UsageTable = (tenant) => {
  const tables = []
  for (const env in tenant.vms) {
    for (const id in tenant.vms[env]) {
      if (env === 'production') {
        if (!tables.Productieomgeving) {
          tables.Productieomgeving = []
        }
        tables.Productieomgeving.push([
          tenant.vms[env][id].name,
          tenant.vms[env][id].status.label,
          tenant.vms[env][id].vcpus,
          tenant.vms[env][id].memory / 1024,
          tenant.vms[env][id].disk,
          0 // TODO: Add network-storage
        ])
      } else if (env === 'accept') {
        if (!tables.Acceptatieomgeving) {
          tables.Acceptatieomgeving = []
        }
        tables.Acceptatieomgeving.push([
          tenant.vms[env][id].name,
          tenant.vms[env][id].status.label,
          tenant.vms[env][id].vcpus,
          tenant.vms[env][id].memory / 1024,
          tenant.vms[env][id].disk,
          0 // TODO: Add network-storage
        ])
      } else if (env === 'testing') {
        if (!tables.Testomgeving) {
          tables.Testomgeving = []
        }
        tables.Testomgeving.push([
          tenant.vms[env][id].name,
          tenant.vms[env][id].status.label,
          tenant.vms[env][id].vcpus,
          tenant.vms[env][id].memory / 1024,
          tenant.vms[env][id].disk,
          0 // TODO: Add network-storage
        ])
      } else if (env === 'demo') {
        if (!tables.Demoomgeving) {
          tables.Demoomgeving = []
        }
        tables.Demoomgeving.push([
          tenant.vms[env][id].name,
          tenant.vms[env][id].status.label,
          tenant.vms[env][id].vcpus,
          tenant.vms[env][id].memory / 1024,
          tenant.vms[env][id].disk,
          0 // TODO: Add network-storage
        ])
      }
    }
  }
  return tables
}

module.exports = { SlaTable, UsageTable }
