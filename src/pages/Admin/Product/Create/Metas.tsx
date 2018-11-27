import * as React from 'react';
import { connect } from 'react-redux';
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, TableRow, TableCell, TextField, Button, Table, TableBody } from '@material-ui/core';
import { Delete, ExpandMore } from '@material-ui/icons';

class PublishCom extends React.Component<any, any>{


  public render() {
    const { metas } = this.props.post;
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Typography>Thuộc tính</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className="d-block w-100">
            <Table className="w-100 mb-3">
              <TableBody>
                {
                  metas.map(({ key, value }: any, i: any) => {
                    return (
                      <TableRow key={i} className="border-0">
                        <TableCell className="p-1 border-0"><TextField placeholder="Tên thuộc tính" className="w-100" onChange={this.handleChangeMeta(i, 'key')} value={key} /></TableCell>
                        <TableCell className="p-1 border-0"><TextField placeholder="Giá trị của thuộc tính" className="w-100" onChange={this.handleChangeMeta(i, 'value')} value={value} /></TableCell>
                        <TableCell style={{width: 170}} className="p-1 border-0"><Button variant="contained" color="default" onClick={this.deleteMeta(i)}><Delete /> Xóa thuộc tính</Button></TableCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
            </Table>
            <Button onClick={this.addMoreMeta} variant="contained" color="default">Thêm thuộc tính</Button>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
  public deleteMeta = (i: number) => (e: any) => {
    const { metas } = this.props.post;
    this.props.onChange('metas')({ target: { value: metas.filter((n: any, j: any) => j !== i) } });
  }
  public addMoreMeta = () => {
    const { metas } = this.props.post;
    metas.push({ key: '', value: '' });
    this.props.onChange('metas')({ target: { value: metas } });
  }
  public handleChangeMeta = (i: number, key: string) => (e: React.ChangeEvent<any>) => {
    const { metas } = this.props.post;
    metas[i][key] = e.target.value;
    this.props.onChange('metas')({ target: { value: metas } });
  }
}

export default connect(e => e)(PublishCom);